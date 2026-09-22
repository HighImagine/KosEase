"use client";
import { useActionState } from "react";
import { adminLoginAction } from "@/app/(auth)/actions";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction as never, null as unknown as { error?: string });

  return (
    <form action={formAction} className="mt-5 space-y-3">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">Alamat Email</label>
        <input id="email" name="email" type="email" required placeholder="admin@example.com" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="password" className="block text-[10px] font-semibold text-text-primary">Kata Sandi</label>
        <input id="password" name="password" type="password" required placeholder="Masukkan kata sandi" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <button type="submit" disabled={pending} className="mt-5 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
