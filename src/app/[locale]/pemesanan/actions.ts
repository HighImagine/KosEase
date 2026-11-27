"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formLocale, withLocale } from "@/lib/locale";
import { triggerWaitlistNotificationsAction } from "@/app/[locale]/(auth)/actions";
import { isAlasanPenolakanKey } from "@/lib/alasan-penolakan";

type ActionResult = { error?: string; success?: string };

function revalidatePemesananPages() {
  for (const loc of ["id", "en"]) {
    revalidatePath(`/${loc}/dashboard/reservasi`);
    revalidatePath(`/${loc}/dashboard/status`);
    revalidatePath(`/${loc}/dashboard/riwayat`);
    revalidatePath(`/${loc}/dashboard`);
    revalidatePath(`/${loc}/dashboard/pemilik`);
    revalidatePath(`/${loc}/dashboard/pemilik/reservasi`);
  }
}

const pesanSchema = z.object({
  kosId: z.string().uuid("Kos tidak valid"),
  kamarId: z.string().uuid("Kamar tidak valid"),
  nama: z.string().min(1, "Wajib diisi"),
  wa: z.string().min(1, "Wajib diisi"),
  tanggal: z.string().min(1, "Wajib diisi"),
  durasi: z.coerce.number().int().min(1).max(24),
  catatan: z.string().max(1000).optional().or(z.literal("")),
  waitlistId: z.string().uuid().optional().or(z.literal("")),
});

// Buat pesanan baru. Total dihitung ulang di server (harga kamar x durasi),
// status awal selalu 'menunggu'. Kamar penuh / kos tidak tayang ditolak.
export async function createPemesananAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = pesanSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const locale = formLocale(formData);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Harus login terlebih dahulu" };

  // Validasi silang ke DB: kamar milik kos itu, kos tayang, kamar tersedia.
  const { data: kosRows } = await supabase
    .from("kos")
    .select("id_kos, status_publikasi")
    .eq("id_kos", parsed.data.kosId)
    .limit(1);
  const kos = kosRows?.[0] as { id_kos: string; status_publikasi: string } | undefined;
  if (!kos || kos.status_publikasi !== "tayang") return { error: "Kos tidak tersedia untuk dipesan" };

  const { data: kamarRows } = await supabase
    .from("kamar")
    .select("id, kos_id, harga, stok, ketersediaan")
    .eq("id", parsed.data.kamarId)
    .limit(1);
  const kamar = kamarRows?.[0] as
    | { id: string; kos_id: string; harga: number; stok: number; ketersediaan: string }
    | undefined;
  if (!kamar || kamar.kos_id !== parsed.data.kosId) return { error: "Kamar tidak valid" };
  if (parsed.data.tanggal < new Date().toISOString().slice(0, 10)) return { error: "Tanggal mulai tidak boleh di masa lalu" };
  if (parsed.data.waitlistId) {
    const { data: rows } = await supabase.from("waitlist").select("*").eq("id", parsed.data.waitlistId).eq("user_id", user.id).limit(1);
    const offer = rows?.[0] as { id: string; kos_id: string; kamar_id: string; nama: string; no_wa: string; slot_mulai: string | null; durasi: number; catatan: string | null; status: string; berlaku_sampai: string | null } | undefined;
    if (!offer || offer.status !== "ditawarkan" || !offer.slot_mulai || !offer.berlaku_sampai || new Date(offer.berlaku_sampai) < new Date()) return { error: "Tawaran waitlist sudah tidak berlaku" };
    if (offer.kos_id !== parsed.data.kosId || offer.kamar_id !== parsed.data.kamarId) return { error: "Tawaran tidak cocok" };
    const { data: booking, error } = await supabase.from("pemesanan").insert({ user_id: user.id, kos_id: offer.kos_id, kamar_id: offer.kamar_id, nama_pemesan: offer.nama, no_wa: offer.no_wa, tanggal_mulai: offer.slot_mulai, durasi: offer.durasi, total_harga: kamar.harga * offer.durasi, catatan: offer.catatan, status: "menunggu", waitlist_id: offer.id }).select("id").single();
    if (error || !booking) return { error: error?.message ?? "Gagal mengklaim tawaran" };
    await supabase.from("waitlist").update({ status: "diklaim", pemesanan_id: booking.id }).eq("id", offer.id).eq("status", "ditawarkan");
    revalidatePemesananPages();
    redirect(withLocale("/dashboard/reservasi?success=1", locale));
  }
  // Sumber kebenaran ketersediaan: stok > 0. Tidak bisa memesan kamar penuh.
  if ((kamar.stok ?? 0) <= 0) {
    // Kos/kamar penuh -> masuk antrian waitlist, bukan langsung ditolak.
    const { error: wlError } = await supabase.from("waitlist").insert({
      user_id: user.id,
      kos_id: parsed.data.kosId,
      kamar_id: parsed.data.kamarId,
      nama: parsed.data.nama,
      no_wa: parsed.data.wa,
      tanggal_mulai: parsed.data.tanggal,
      durasi: parsed.data.durasi,
      catatan: parsed.data.catatan || null,
      status: "menunggu",
    });
    if (wlError) return { error: wlError.message };
    revalidatePemesananPages();
    return { success: "Kamar penuh — Anda masuk antrian waitlist" };
  }

  const total = (kamar.harga ?? 0) * parsed.data.durasi;
  const { error } = await supabase.from("pemesanan").insert({
    user_id: user.id,
    kos_id: parsed.data.kosId,
    kamar_id: parsed.data.kamarId,
    nama_pemesan: parsed.data.nama,
    no_wa: parsed.data.wa,
    tanggal_mulai: parsed.data.tanggal,
    durasi: parsed.data.durasi,
    total_harga: total,
    catatan: parsed.data.catatan || null,
    status: "menunggu",
  });
  if (error) return { error: error.message };
  revalidatePemesananPages();
  redirect(withLocale("/dashboard/reservasi?success=1", locale));
}

// Batalkan pesanan milik sendiri. Hanya dari status 'menunggu'
// (dikunci juga di RLS, bukan cuma di sini).
export async function cancelPemesananAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("pemesananId") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Harus login terlebih dahulu" };
  const { data } = await supabase.from("pemesanan").select("id, user_id, status").eq("id", id).limit(1);
  const row = data?.[0] as { id: string; user_id: string; status: string } | undefined;
  if (!row) return { error: "Pesanan tidak ditemukan" };
  if (row.user_id !== user.id) return { error: "Bukan pesanan Anda" };
  if (row.status !== "menunggu") return { error: "Hanya pesanan menunggu yang bisa dibatalkan" };
  const { error } = await supabase.from("pemesanan").update({ status: "dibatalkan" }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePemesananPages();
  return { success: "Pesanan dibatalkan" };
}

// Konfirmasi/tolak oleh pemilik kos (atau admin). Hanya dari 'menunggu'.
export async function setPemesananStatusAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("pemesananId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "dikonfirmasi" && status !== "ditolak") return { error: "Status tidak valid" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Harus login terlebih dahulu" };

  const { data } = await supabase.from("pemesanan").select("id, user_id, kos_id, kamar_id, status, waitlist_id").eq("id", id).limit(1);
  const row = data?.[0] as { id: string; user_id: string; kos_id: string; kamar_id: string; status: string; waitlist_id?: string | null } | undefined;
  if (!row) return { error: "Pesanan tidak ditemukan" };
  if (row.status !== "menunggu") return { error: "Pesanan sudah diproses" };

  let allowed = false;
  let kosNama = "Kos";
  try {
    const [{ data: prof }, { data: kosRows }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).limit(1),
      supabase.from("kos").select("id_pemilik, nama").eq("id_kos", row.kos_id).limit(1),
    ]);
    const role = ((prof?.[0] as { role?: string } | undefined)?.role ?? "").toLowerCase();
    const kosRow = kosRows?.[0] as { id_pemilik?: string; nama?: string } | undefined;
    if (kosRow?.nama) kosNama = kosRow.nama;
    if (role === "admin") allowed = true;
    else allowed = kosRow?.id_pemilik === user.id;
  } catch {}
  if (!allowed) return { error: "Tidak berhak memproses pesanan ini" };

  // Konfirmasi wajib lewat RPC: satu transaksi (cek status -> decrement stok
  // -> update status) supaya tidak ada race condition saat dua pemanggil mencoba
  // mengonfirmasi pemesanan untuk kamar terakhir.
  if (status === "dikonfirmasi") {
    const { data: rpcData, error: rpcError } = await supabase.rpc("konfirmasi_pemesanan", { p_id: id });
    if (rpcError) return { error: rpcError.message };
    const rpcResult = typeof rpcData === "string" ? rpcData : "";
    if (rpcResult === "stok_habis") return { error: "Kamar sudah penuh" };
    if (rpcResult !== "ok") return { error: "Pesanan tidak valid" };

    revalidatePemesananPages();
    // Pas booking dikonfirmasi, kamar yang tadinya penuh bisa jadi punya
    // slot akhir baru (stok > 0). Rekomputasi slot final waitlist + notifikasi.
    await triggerWaitlistNotificationsAction(null, formData);
    return { success: "Pesanan dikonfirmasi" };
  }

  // Alasan disimpan sebagai key (+ teks custom untuk "lainnya"), bukan kalimat
  // terjemahan, supaya bisa dirender dalam bahasa penyewa.
  const alasanKey = String(formData.get("alasanKey") ?? "");
  const alasanCustom = String(formData.get("alasanCustom") ?? "").trim();
  if (!isAlasanPenolakanKey(alasanKey)) return { error: "Pilih alasan penolakan" };
  if (alasanKey === "lainnya" && !alasanCustom) return { error: "Isi alasan penolakan" };
  if (alasanCustom.length > 200) return { error: "Alasan penolakan maksimal 200 karakter" };

  // Guard status di query supaya double-submit tidak memproses pesanan dua kali.
  const { data: updated, error } = await supabase
    .from("pemesanan")
    .update({
      status: "ditolak",
      alasan_key: alasanKey,
      alasan_custom: alasanKey === "lainnya" ? alasanCustom : null,
      ditolak_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "menunggu")
    .select("id");
  if (error) return { error: error.message };
  if (!updated || updated.length === 0) return { error: "Pesanan sudah diproses" };

  if (row.waitlist_id) {
    const { error: waitlistError } = await supabase
      .from("waitlist")
      .update({ status: "selesai" })
      .eq("id", row.waitlist_id);
    if (waitlistError) console.error("Gagal menutup waitlist:", waitlistError.message);
  }

  // Notifikasi hanya menunjuk ke halaman reservasi; alasan dirender dari
  // alasan_key di sana. Kegagalan notifikasi tidak membatalkan penolakan.
  try {
    const admin = createAdminClient();
    const { error: notifError } = await admin.from("notifikasi").insert({
      user_id: row.user_id,
      jenis: "pemesanan",
      judul: `Reservasi ${kosNama} Ditolak`,
      isi: "Pemilik menolak reservasi Anda. Alasan penolakan dapat dilihat di halaman Reservasi.",
      href: "/dashboard/reservasi",
    });
    if (notifError) console.error("Gagal mengirim notifikasi penolakan:", notifError.message);
  } catch (err) {
    console.error("Gagal mengirim notifikasi penolakan:", err);
  }

  revalidatePemesananPages();
  return { success: "Pesanan ditolak" };
}
