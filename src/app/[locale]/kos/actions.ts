"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formLocale, withLocale } from "@/lib/locale";
import type { Ketersediaan } from "@/lib/db/types";

type ActionResult = { error?: string; success?: string };

// Revalidasi KEDUA locale (path publik maupun dashboard ada di /id dan /en).
function revalidateKosPages(kosId?: string) {
  for (const loc of ["id", "en"]) {
    revalidatePath(`/${loc}/dashboard/pemilik/kos`);
    revalidatePath(`/${loc}/dashboard/admin/kos`);
    revalidatePath(`/${loc}`);
    revalidatePath(`/${loc}/cari-kos`);
    if (kosId) {
      revalidatePath(`/${loc}/dashboard/pemilik/kos/${kosId}`);
      revalidatePath(`/${loc}/kos/${kosId}`);
    }
  }
}

const PEMILIK_ROLES = ["pemilik", "pemilik_kos"];

async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null as string | null };
  let role: string | null = null;
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
    role = ((data?.[0] as { role?: unknown } | undefined)?.role as string | undefined)?.toLowerCase() ?? null;
  } catch {}
  return { supabase, user, role };
}

// Pastikan user login dan (pemilik kos ybs ATAU admin). Kembalikan error jika tidak.
async function assertKosAccess(kosId: string) {
  const { supabase, user, role } = await getSession();
  if (!user) return { error: "Harus login terlebih dahulu" as const };
  const { data, error } = await supabase.from("kos").select("id_kos, id_pemilik").eq("id_kos", kosId).limit(1);
  const row = data?.[0] as { id_kos: string; id_pemilik: string } | undefined;
  if (error || !row) return { error: "Kos tidak ditemukan" as const };
  if (role !== "admin" && row.id_pemilik !== user.id) return { error: "Tidak berhak mengelola kos ini" as const };
  return { supabase, user, role };
}

// harga termurah kos = min(harga kamar). Dipanggil setiap kamar berubah.
async function recalcHargaMin(kosId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("kamar")
    .select("harga")
    .eq("kos_id", kosId)
    .order("harga", { ascending: true })
    .limit(1);
  const min = (data?.[0] as { harga?: number } | undefined)?.harga;
  if (typeof min === "number") {
    await supabase.from("kos").update({ harga: min }).eq("id_kos", kosId);
  }
}

const kosSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  tipe: z.enum(["Campur", "Laki-laki", "Perempuan"], { message: "Tipe tidak valid" }),
  lokasi: z.string().min(2, "Lokasi wajib diisi"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  harga: z.coerce.number().int("Harga harus bilangan bulat").min(0, "Harga tidak valid"),
  status_publikasi: z.enum(["draft", "tayang"]).default("draft"),
  deskripsi: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional().or(z.literal("")),
});

export async function createKosAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const { supabase, user, role } = await getSession();
  if (!user) return { error: "Harus login terlebih dahulu" };
  if (role !== "admin" && !PEMILIK_ROLES.includes(role ?? "")) {
    return { error: "Hanya pemilik kos atau admin yang dapat menambah kos" };
  }
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = kosSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { data, error } = await supabase
    .from("kos")
    .insert({
      id_pemilik: user.id,
      nama: parsed.data.nama,
      tipe: parsed.data.tipe,
      lokasi: parsed.data.lokasi,
      alamat: parsed.data.alamat,
      harga: parsed.data.harga,
      status_publikasi: parsed.data.status_publikasi,
      deskripsi: parsed.data.deskripsi || null,
    })
    .select("id_kos")
    .limit(1);
  if (error) return { error: error.message };
  const idKos = (data?.[0] as { id_kos?: string } | undefined)?.id_kos;
  const locale = formLocale(formData);
  revalidateKosPages(idKos);
  if (idKos) redirect(withLocale(`/dashboard/pemilik/kos/${idKos}`, locale));
  redirect(withLocale("/dashboard/pemilik/kos", locale));
}

export async function updateKosAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = kosSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { error } = await access.supabase
    .from("kos")
    .update({
      nama: parsed.data.nama,
      tipe: parsed.data.tipe,
      lokasi: parsed.data.lokasi,
      alamat: parsed.data.alamat,
      harga: parsed.data.harga,
      status_publikasi: parsed.data.status_publikasi,
      deskripsi: parsed.data.deskripsi || null,
    })
    .eq("id_kos", kosId);
  if (error) return { error: error.message };
  revalidateKosPages(kosId);
  return { success: "Data kos berhasil disimpan" };
}

export async function setPublikasiAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "draft" && status !== "tayang") return { error: "Status tidak valid" };
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const { error } = await access.supabase.from("kos").update({ status_publikasi: status }).eq("id_kos", kosId);
  if (error) return { error: error.message };
  revalidateKosPages(kosId);
  return { success: status === "tayang" ? "Kos ditayangkan" : "Kos dikembalikan ke draft" };
}

// Hapus manual berurutan (tanpa cascade FK): file bucket -> galeri -> kamar ->
// relasi fasilitas -> kos.
export async function deleteKosAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const { supabase } = access;

  const { data: galeriRows } = await supabase.from("galeri").select("id, image_url").eq("kos_id", kosId);
  const paths = ((galeriRows ?? []) as { id: string; image_url: string }[])
    .map((g) => g.image_url.split("/kos-foto/")[1])
    .filter((p): p is string => !!p);
  if (paths.length > 0) {
    await supabase.storage.from("kos-foto").remove(paths);
  }
  await supabase.from("galeri").delete().eq("kos_id", kosId);
  await supabase.from("kamar").delete().eq("kos_id", kosId);
  await supabase.from("kos_fasilitas").delete().eq("kos_id", kosId);
  const { error } = await supabase.from("kos").delete().eq("id_kos", kosId);
  if (error) return { error: error.message };

  const isAdminUser = access.role === "admin";
  const locale = formLocale(formData);
  revalidateKosPages();
  redirect(withLocale(isAdminUser ? "/dashboard/admin/kos" : "/dashboard/pemilik/kos", locale));
}

const kamarSchema = z.object({
  nama: z.string().min(2, "Nama kamar minimal 2 karakter"),
  ukuran: z.string().max(50).optional().or(z.literal("")),
  harga: z.coerce.number().int("Harga harus bilangan bulat").min(0, "Harga tidak valid"),
  stok: z.coerce.number().int("Stok harus bilangan bulat").min(0, "Stok tidak valid"),
  deskripsi: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().or(z.literal("")),
});

export async function upsertKamarAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const kamarId = String(formData.get("kamarId") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = kamarSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const ketersediaan: Ketersediaan = parsed.data.stok > 0 ? "Tersedia" : "Penuh";
  const payload = {
    kos_id: kosId,
    nama: parsed.data.nama,
    ukuran: parsed.data.ukuran || null,
    harga: parsed.data.harga,
    stok: parsed.data.stok,
    ketersediaan,
    deskripsi: parsed.data.deskripsi || null,
  };
  const { error } = kamarId
    ? await access.supabase.from("kamar").update(payload).eq("id", kamarId).eq("kos_id", kosId)
    : await access.supabase.from("kamar").insert(payload);
  if (error) return { error: error.message };
  await recalcHargaMin(kosId);
  revalidateKosPages(kosId);
  return { success: kamarId ? "Kamar diperbarui" : "Kamar ditambahkan" };
}

export async function deleteKamarAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const kamarId = String(formData.get("kamarId") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const { error } = await access.supabase.from("kamar").delete().eq("id", kamarId).eq("kos_id", kosId);
  if (error) return { error: error.message };
  await recalcHargaMin(kosId);
  revalidateKosPages(kosId);
  return { success: "Kamar dihapus" };
}

// Ganti seluruh set fasilitas kos dengan daftar id terpilih.
export async function setKosFasilitasAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const ids = formData.getAll("fasilitasId").map(String).filter(Boolean);
  const { error: delError } = await access.supabase.from("kos_fasilitas").delete().eq("kos_id", kosId);
  if (delError) return { error: delError.message };
  if (ids.length > 0) {
    const { error } = await access.supabase
      .from("kos_fasilitas")
      .insert(ids.map((fid) => ({ kos_id: kosId, fasilitas_id: fid })));
    if (error) return { error: error.message };
  }
  revalidateKosPages(kosId);
  return { success: "Fasilitas diperbarui" };
}

export async function uploadGaleriAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const kosId = String(formData.get("kosId") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const access = await assertKosAccess(kosId);
  if ("error" in access) return { error: access.error };
  const file = formData.get("foto") as File | null;
  if (!file || file.size === 0) return { error: "Pilih file foto terlebih dahulu" };
  if (file.size > 2 * 1024 * 1024) return { error: "Ukuran foto maksimal 2MB" };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Format foto harus JPG, PNG, atau WebP" };
  }
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${access.user.id}/${kosId}-${Date.now()}.${ext}`;
  const { error: uploadError } = await access.supabase.storage.from("kos-foto").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) return { error: uploadError.message };
  const {
    data: { publicUrl },
  } = access.supabase.storage.from("kos-foto").getPublicUrl(path);
  const { error } = await access.supabase
    .from("galeri")
    .insert({ kos_id: kosId, image_url: publicUrl, caption: caption || null });
  if (error) return { error: error.message };
  revalidateKosPages(kosId);
  return { success: "Foto ditambahkan" };
}

export async function deleteGaleriAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const galeriId = String(formData.get("galeriId") ?? "");
  const { supabase, user } = await getSession();
  if (!user) return { error: "Harus login terlebih dahulu" };
  const { data } = await supabase.from("galeri").select("id, kos_id, image_url").eq("id", galeriId).limit(1);
  const row = data?.[0] as { id: string; kos_id: string; image_url: string } | undefined;
  if (!row) return { error: "Foto tidak ditemukan" };
  const access = await assertKosAccess(row.kos_id);
  if ("error" in access) return { error: access.error };
  const path = row.image_url.split("/kos-foto/")[1];
  if (path) await supabase.storage.from("kos-foto").remove([path]);
  const { error } = await supabase.from("galeri").delete().eq("id", galeriId);
  if (error) return { error: error.message };
  revalidateKosPages(row.kos_id);
  return { success: "Foto dihapus" };
}
