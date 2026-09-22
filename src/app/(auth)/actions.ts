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
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
      role = (profile?.role as string) ?? null;
    }
  } catch {}
  // normalize: "user"/"pencari" dianggap "penyewa"
  const norm = role?.toLowerCase();
  if (norm === "pemilik" || norm === "pemilik_kos" || norm === "admin") redirect("/dashboard");
  // penyewa/ -> homepage
  redirect("/");
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

export async function resetPasswordAction(_prev: unknown, formData: FormData) {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const parsed = resetSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  redirect("/login?reset=1");
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

  const { error: profileError } = await supabase.from("profiles").update({ full_name: nama, avatar_url: avatarUrl, phone }).eq("id", user.id).select().single();
  if (profileError) return { error: profileError.message, currentFullName: nama, currentEmail, currentPhone: phone ?? "", currentAvatar: null };

  await supabase.auth.updateUser({ data: { full_name: nama } });

  return { success: "Profil berhasil diperbarui", currentFullName: nama, currentEmail, currentPhone: phone ?? "", currentAvatar: avatarUrl };
}
