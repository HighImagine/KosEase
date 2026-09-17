"use client";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/(auth)/actions";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction as never, null as unknown as { error?: string; success?: string });
  return (
    <form action={formAction} className="mt-5 space-y-3">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
      <input name="email" type="email" required placeholder="email@example.com" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary" />
      <button type="submit" disabled={pending} className="w-full rounded-md bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
        {pending ? "Mengirim..." : "Kirim Link Reset"}
      </button>
    </form>
  );
}

