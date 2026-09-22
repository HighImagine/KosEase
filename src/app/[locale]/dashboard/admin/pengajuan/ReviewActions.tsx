"use client";
import { useActionState, useState } from "react";
import { approvePengajuanAction, rejectPengajuanAction } from "@/app/[locale]/(auth)/actions";
import { useLocale, useTranslations } from "next-intl";

type FormState = { error?: string } | null;

export function ApproveButton({ pengajuanId }: { pengajuanId: string }) {
  const t = useTranslations("ReviewActions");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(approvePengajuanAction as never, null as FormState);
  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="pengajuanId" value={pengajuanId} />
      <input type="hidden" name="locale" value={locale} />
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={pending} className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50">
        {pending ? t("approving") : t("approve")}
      </button>
    </form>
  );
}

export function RejectButton({ pengajuanId }: { pengajuanId: string }) {
  const t = useTranslations("ReviewActions");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(rejectPengajuanAction as never, null as FormState);
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600">
        {t("reject")}
      </button>
    );
  }
  return (
    <form action={formAction} className="flex flex-1 items-center gap-2">
      <input type="hidden" name="pengajuanId" value={pengajuanId} />
      <input type="hidden" name="locale" value={locale} />
      <input
        name="alasanTolak"
        required
        placeholder={t("reasonPh")}
        className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none placeholder:text-text-secondary focus:border-error"
      />
      {state?.error && <span className="text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={pending} className="shrink-0 rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50">
        {pending ? t("rejecting") : t("confirmReject")}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary">
        {t("cancel")}
      </button>
    </form>
  );
}
