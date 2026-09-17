"use client";
import { useActionState } from "react";
import { registerAction } from "@/app/(auth)/actions";

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction as never, null as unknown as { error?: string });
  return (
    <form action={formAction} className="mt-5 space-y-3">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <div>
        <label htmlFor="nama" className="block text-[10px] font-semibold text-text-primary">Nama Lengkap</label>
        <input id="nama" name="nama" type="text" required placeholder="Masukkan nama lengkap Anda" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">Alamat Email</label>
        <input id="email" name="email" type="email" required placeholder="contoh@mahasiswa.ac.id" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="password" className="block text-[10px] font-semibold text-text-primary">Kata Sandi</label>
        <input id="password" name="password" type="password" required placeholder="Minimal 8 karakter" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="password_confirmation" className="block text-[10px] font-semibold text-text-primary">Konfirmasi Kata Sandi</label>
        <input id="password_confirmation" name="password_confirmation" type="password" required placeholder="Ulangi kata sandi Anda" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div className="flex items-start gap-2 pt-2">
        <input id="terms" name="terms" type="checkbox" required className="mt-0.5 accent-primary" />
        <label htmlFor="terms" className="text-[10px] leading-4 text-text-secondary">Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi.</label>
      </div>
      <button type="submit" disabled={pending} className="mt-3 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
