"use client";
import { useActionState } from "react";
import { resetPasswordAction } from "@/app/[locale]/(auth)/actions";
import { useLocale, useTranslations } from "next-intl";

export default function ResetPasswordForm() {
  const t = useTranslations("Reset");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(resetPasswordAction as never, null as unknown as { error?: string });
  return (
    <form action={formAction} className="mt-5 space-y-3">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <input type="hidden" name="locale" value={locale} />
      <input name="password" type="password" required placeholder={t("newPh")} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary" />
      <input name="confirm" type="password" required placeholder={t("confirmPh")} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-primary" />
      <button type="submit" disabled={pending} className="w-full rounded-md bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
