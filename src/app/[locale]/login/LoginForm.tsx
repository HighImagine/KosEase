"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/[locale]/(auth)/actions";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LoginForm() {
  const t = useTranslations("Login");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const registered = searchParams.get("registered");
  const [state, formAction, pending] = useActionState(loginAction as never, null as unknown as { error?: string });

  return (
    <form action={formAction} className="mt-5 space-y-3">
      {registered && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{t("registered")}</p>}
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">{t("email")}</label>
        <input id="email" name="email" type="email" required placeholder={t("emailPh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-[10px] font-semibold text-text-primary">{t("password")}</label>
          <Link href="/lupa-password" className="text-[10px] font-semibold text-primary hover:text-primary-dark">{t("forgot")}</Link>
        </div>
        <input id="password" name="password" type="password" required placeholder={t("passwordPh")} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>
      <button type="submit" disabled={pending} className="mt-5 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
