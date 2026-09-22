"use client";
import { useActionState } from "react";
import { registerAction } from "@/app/[locale]/(auth)/actions";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterForm() {
  const t = useTranslations("Register");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(registerAction as never, null as unknown as { error?: string });
  return (
    <form action={formAction} className="mt-5 space-y-3">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="nama" className="block text-[10px] font-semibold text-text-primary">{t("name")}</label>
        <input id="nama" name="nama" type="text" required placeholder={t("namePh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">{t("email")}</label>
        <input id="email" name="email" type="email" required placeholder={t("emailPh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="password" className="block text-[10px] font-semibold text-text-primary">{t("password")}</label>
        <input id="password" name="password" type="password" required placeholder={t("passwordPh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="password_confirmation" className="block text-[10px] font-semibold text-text-primary">{t("confirm")}</label>
        <input id="password_confirmation" name="password_confirmation" type="password" required placeholder={t("confirmPh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div className="flex items-start gap-2 pt-2">
        <input id="terms" name="terms" type="checkbox" required className="mt-0.5 accent-primary" />
        <label htmlFor="terms" className="text-[10px] leading-4 text-text-secondary">{t("terms")}</label>
      </div>
      <button type="submit" disabled={pending} className="mt-3 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
