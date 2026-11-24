"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const idSchema = z.string().uuid();
const addMonths = (date: string, months: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.getUTCDate();
  const targetMonth = d.getUTCMonth() + months;
  d.setUTCMonth(targetMonth, 1);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), targetMonth + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d.toISOString().slice(0, 10);
};
const revalidate = () => { for (const loc of ["id", "en"]) { revalidatePath(`/${loc}/dashboard/reservasi`); revalidatePath(`/${loc}/dashboard/pemilik/reservasi`); } };

export async function createPengajuanPerpanjanganAction(_prev: unknown, formData: FormData) {
  const id = idSchema.safeParse(String(formData.get("pemesananId") ?? ""));
  const months = z.coerce.number().int().min(1).max(24).safeParse(formData.get("tambahanBulan"));
  if (!id.success || !months.success) return { error: "Data perpanjangan tidak valid" };
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return { error: "Harus login terlebih dahulu" };
  const { data: rows } = await supabase.from("pemesanan").select("id,user_id,status,tanggal_mulai,durasi").eq("id", id.data).eq("user_id", user.id).limit(1);
  const booking = rows?.[0] as { id: string; user_id: string; status: string; tanggal_mulai: string; durasi: number } | undefined;
  if (!booking || booking.status !== "dikonfirmasi") return { error: "Reservasi aktif tidak ditemukan" };
  const end = new Date(`${addMonths(booking.tanggal_mulai, booking.durasi)}T23:59:59Z`); const start = new Date(end); start.setUTCDate(start.getUTCDate() - 30);
  if (new Date() < start || new Date() > end) return { error: "Perpanjangan hanya dapat diajukan H-30 sampai akhir sewa" };
  const { data: existing } = await supabase.from("pengajuan_perpanjangan").select("id").eq("pemesanan_id", booking.id).eq("status", "menunggu").limit(1);
  if (existing?.length) return { error: "Masih ada pengajuan perpanjangan yang menunggu" };
  const { error } = await supabase.from("pengajuan_perpanjangan").insert({ pemesanan_id: booking.id, user_id: user.id, tambahan_bulan: months.data });
  if (error) return { error: error.message }; revalidate(); return { success: "Pengajuan perpanjangan dikirim" };
}

export async function decidePengajuanPerpanjanganAction(_prev: unknown, formData: FormData) {
  const requestId = idSchema.safeParse(String(formData.get("pengajuanId") ?? "")); const decision = String(formData.get("decision") ?? ""); const conflict = String(formData.get("conflict") ?? "");
  if (!requestId.success || !["setujui", "tolak"].includes(decision)) return { error: "Data keputusan tidak valid" };
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return { error: "Harus login terlebih dahulu" };
  const { data: reqRows } = await supabase.from("pengajuan_perpanjangan").select("*").eq("id", requestId.data).limit(1); const req = reqRows?.[0] as { id: string; pemesanan_id: string; tambahan_bulan: number; status: string; user_id: string } | undefined;
  if (!req || req.status !== "menunggu") return { error: "Pengajuan sudah diproses" };
  const { data: bookingRows } = await supabase.from("pemesanan").select("*").eq("id", req.pemesanan_id).limit(1); const booking = bookingRows?.[0] as { id: string; kos_id: string; kamar_id: string; tanggal_mulai: string; durasi: number } | undefined;
  if (!booking) return { error: "Reservasi tidak ditemukan" };
  const { data: kosRows } = await supabase.from("kos").select("id_pemilik").eq("id_kos", booking.kos_id).limit(1); if ((kosRows?.[0] as { id_pemilik?: string } | undefined)?.id_pemilik !== user.id) return { error: "Tidak berhak" };
  if (decision === "tolak") { await supabase.from("pengajuan_perpanjangan").update({ status: "ditolak", diproses_oleh: user.id, diproses_at: new Date().toISOString() }).eq("id", req.id); revalidate(); return { success: "Perpanjangan ditolak" }; }
  const newEnd = addMonths(booking.tanggal_mulai, booking.durasi + req.tambahan_bulan);
  const { data: conflicts } = await supabase.from("pemesanan").select("id,waitlist_id,user_id").eq("kamar_id", booking.kamar_id).eq("status", "menunggu").not("waitlist_id", "is", null).lt("tanggal_mulai", newEnd);
  const admin = createAdminClient();
  if (conflict === "perpanjangan") {
    for (const item of conflicts ?? []) {
      await supabase.from("pemesanan").update({ status: "ditolak" }).eq("id", item.id);
      if (item.waitlist_id) await supabase.from("waitlist").update({ status: "selesai" }).eq("id", item.waitlist_id);
      await admin.from("notifikasi").insert({ user_id: item.user_id, jenis: "perpanjangan", judul: "Booking waitlist dibatalkan", isi: "Pemilik menyetujui perpanjangan penyewa saat ini." });
    }
  }
  await supabase.from("pemesanan").update({ durasi: booking.durasi + req.tambahan_bulan }).eq("id", booking.id);
  await supabase.from("pengajuan_perpanjangan").update({ status: "disetujui", diproses_oleh: user.id, diproses_at: new Date().toISOString() }).eq("id", req.id);
  await admin.from("notifikasi").insert({ user_id: req.user_id, jenis: "perpanjangan", judul: "Perpanjangan disetujui", isi: "Durasi sewa Anda telah diperpanjang." }); revalidate(); return { success: "Perpanjangan disetujui" };
}
