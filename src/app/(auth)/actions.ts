"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    options: { data: { nama_lengkap: nama } },
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
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: "Email atau kata sandi salah" };
  redirect((formData.get("next") as string) || "/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
