"use client";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { updateUserRoleAction } from "@/app/[locale]/(auth)/actions";

type State = { error?: string } | null;

export default function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const t = useTranslations("AdminPengguna");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(updateUserRoleAction as never, null as State);
  const norm = currentRole.toLowerCase() === "pemilik_kos" ? "pemilik" : currentRole.toLowerCase();
  const defaultRole = norm === "admin" || norm === "pemilik" ? norm : "penyewa";

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={defaultRole}
        disabled={pending}
        aria-label={t("selectRole")}
        className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
      >
        <option value="penyewa">{t("rolePenyewa")}</option>
        <option value="pemilik">{t("rolePemilik")}</option>
        <option value="admin">{t("roleAdmin")}</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? t("saving") : t("save")}
      </button>
      {state?.error && <span className="text-[11px] text-error">{state.error}</span>}
    </form>
  );
}
