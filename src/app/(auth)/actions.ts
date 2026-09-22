"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(5, "Nomor minimal 5 digit").optional().or(z.literal("")),
});

const registerSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
  password_confirmation: z.string(),
  terms: z.literal("on", { message: "Harus menyetujui syarat" }),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Konfirmasi tidak cocok",
  path: ["password_confirmation"],
});

export async function registerAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = registerSchema.safeParse({ ...raw, terms: raw.terms ?? undefined });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { nama, email, password } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: nama } },
  });
  if (error) return { error: error.message };
  redirect("/login?registered=1");
}

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Wajib diisi"),
});

export async function loginAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "Email atau kata sandi salah" };
  const next = formData.get("next") as string | null;
  if (next) redirect(next);
  // PRD 3 aktor: penyewa/user, pemilik kos, admin (kamu)
  let role: string | null = null;
  try {
    const userId = data.user?.id;
    if (userId) {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", userId).limit(1);
      const profileDatum = profileData?.[0];
      role = (profileDatum?.role as string) ?? null;
    }
  } catch {}
  // normalize: "user"/"pencari" dianggap "penyewa"
const norm = role?.toLowerCase();
    if (norm === "pemilik") redirect("/dashboard");
    if (norm === "pemilik_kos") redirect("/dashboard");
    if (norm === "admin") redirect("/dashboard/admin");
    // penyewa/ -> homepage
    redirect("/");
}

export async function adminLoginAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "Email atau kata sandi salah" };
  let role: string | null = null;
  try {
    const userId = data.user?.id;
    if (userId) {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", userId).limit(1);
      const profileDatum = profileData?.[0];
      role = (profileDatum?.role as string) ?? null;
    }
  } catch {}
  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Akses hanya untuk admin" };
  }
  redirect("/dashboard/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const parsed = z.string().email("Email tidak valid").safeParse(email);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) return { error: error.message };
  return { success: "Link reset telah dikirim ke email Anda jika terdaftar." };
}

const resetSchema = z.object({
  password: z.string().min(8, "Minimal 8 karakter"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Konfirmasi tidak cocok", path: ["confirm"] });

// Batas panjang pengajuan dilonggarkan sementara untuk testing (hanya wajib isi).
// TODO: kembalikan min yang wajar (nama 2, lainnya 5) sebelum rilis.
const pengajuanSchema = z.object({
  nama: z.string().min(1, "Wajib diisi"),
  phone: z.string().min(1, "Wajib diisi"),
  alamat: z.string().min(1, "Wajib diisi"),
  alasan: z.string().min(1, "Wajib diisi"),
  info_kos: z.string().min(1, "Wajib diisi"),
});

export async function resetPasswordAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = resetSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message, currentFullName: "", currentEmail: "", currentPhone: "", currentAvatar: null };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  redirect("/login?reset=1");
}

const DOKUMEN_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const DOKUMEN_MAX = 10 * 1024 * 1024; // 10MB

export type PengajuanValues = { nama: string; phone: string; alamat: string; alasan: string; info_kos: string };

export async function pengajuanPemilikAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  // Kembalikan isian agar form tidak kosong saat error (UX).
  const values: PengajuanValues = {
    nama: raw.nama ?? "",
    phone: raw.phone ?? "",
    alamat: raw.alamat ?? "",
    alasan: raw.alasan ?? "",
    info_kos: raw.info_kos ?? "",
  };
  const parsed = pengajuanSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const { nama, phone, alamat, alasan, info_kos } = parsed.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User tidak ditemukan", values };

  // Dokumen opsional; bila ada, simpan ke bucket privat, catat path-nya.
  let dokumenUrl: string | null = null;
  const dokumen = formData.get("dokumen") as File | null;
  if (dokumen && dokumen.size > 0) {
    if (dokumen.size > DOKUMEN_MAX) return { error: "Dokumen maksimal 10MB", values };
    if (!DOKUMEN_MIME.includes(dokumen.type)) return { error: "Dokumen harus PDF, JPG, PNG, atau WebP", values };
    const ext = dokumen.name.split(".").pop() ?? "pdf";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("dokumen-pengajuan").upload(path, dokumen, { upsert: false });
    if (uploadError) return { error: uploadError.message, values };
    dokumenUrl = path;
  }

  const { error } = await supabase.from("pengajuan_pemilik").insert({ user_id: user.id, nama_lengkap: nama, no_hp: phone, alamat, alasan, info_kos, dokumen_url: dokumenUrl, status: "menunggu_verifikasi" });
  if (error) return { error: error.message, values };
  redirect("/dashboard/pengajuan-pemilik?success=1");
}

export async function approvePengajuanAction(_prev: unknown, formData: FormData) {
  const pengajuanId = formData.get("pengajuanId") as string;
  const supabase = await createClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  const { data: pengajuan } = await supabase.from("pengajuan_pemilik").select("user_id").eq("id", pengajuanId).limit(1);
  const pengajuanDatum = pengajuan?.[0];
  if (pengajuanDatum?.user_id) {
    await supabase.from("profiles").update({ role: "pemilik" }).eq("id", pengajuanDatum.user_id).select().limit(1);
  }
  const { error } = await supabase.from("pengajuan_pemilik").update({ status: "disetujui", diverifikasi_oleh: admin?.id ?? null, diverifikasi_at: new Date().toISOString() }).eq("id", pengajuanId).select().limit(1);
  if (error) return { error: error.message };
  redirect("/dashboard/admin/pengajuan");
}

export async function rejectPengajuanAction(_prev: unknown, formData: FormData) {
  const pengajuanId = formData.get("pengajuanId") as string;
  const alasanTolak = String(formData.get("alasanTolak") ?? "Ditolak oleh admin");
  const supabase = await createClient();
  const { data: { user: admin } } = await supabase.auth.getUser();
  const { error } = await supabase.from("pengajuan_pemilik").update({ status: "ditolak", alasan_tolak: alasanTolak, diverifikasi_oleh: admin?.id ?? null, diverifikasi_at: new Date().toISOString() }).eq("id", pengajuanId).select().limit(1);
  if (error) return { error: error.message };
  redirect("/dashboard/admin/pengajuan");
}

export async function updateProfileAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = profileSchema.safeParse({ nama: raw.nama, phone: raw.phone ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message, currentFullName: raw.nama ?? "", currentEmail: "", currentPhone: raw.phone ?? "", currentAvatar: null };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentEmail = user?.email ?? "";
  if (!user) return { error: "User tidak ditemukan", currentFullName: parsed.data.nama, currentEmail, currentPhone: parsed.data.phone ?? "", currentAvatar: null };

  const { nama, phone } = parsed.data;
  let avatarUrl: string | null = null;

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile, { cacheControl: "3600", upsert: true });
    if (!uploadError) {
      const { data } = await supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = data.publicUrl;
    }
  }

  const { error: profileError } = await supabase.from("profiles").update({ full_name: nama, avatar_url: avatarUrl, phone }).eq("id", user.id).select().limit(1);
  if (profileError) return { error: profileError.message, currentFullName: nama, currentEmail, currentPhone: phone ?? "", currentAvatar: null };

  await supabase.auth.updateUser({ data: { full_name: nama } });

  return { success: "Profil berhasil diperbarui", currentFullName: nama, currentEmail, currentPhone: phone ?? "", currentAvatar: avatarUrl };
}
