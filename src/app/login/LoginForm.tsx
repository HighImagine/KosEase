"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const registered = searchParams.get("registered");
  const [state, formAction, pending] = useActionState(loginAction as never, null as unknown as { error?: string });

  return (
    <form action={formAction} className="mt-5 space-y-3">
      {registered && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">Akun dibuat, silakan masuk.</p>}
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">Alamat Email</label>
        <input id="email" name="email" type="email" required placeholder="contoh@mahasiswa.ac.id" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-[10px] font-semibold text-text-primary">Kata Sandi</label>
          <a href="/lupa-password" className="text-[10px] font-semibold text-primary hover:text-primary-dark">Lupa Kata Sandi?</a>
        </div>
        <input id="password" name="password" type="password" required placeholder="Masukkan kata sandi Anda" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <button type="submit" disabled={pending} className="mt-5 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
