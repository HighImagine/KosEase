"use client";
import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import {
  cancelPemesananAction,
  setPemesananStatusAction,
} from "@/app/[locale]/pemesanan/actions";

type FormState = { error?: string; success?: string } | null;

function hidden(id: string) {
  return <input type="hidden" name="pemesananId" value={id} />;
}

export function ConfirmButton({ pemesananId }: { pemesananId: string }) {
  const t = useTranslations("ReservasiMasuk");
  const [state, formAction, pending] = useActionState(setPemesananStatusAction as never, null as FormState);
  return (
    <form action={formAction} className="inline">
      {hidden(pemesananId)}
      <input type="hidden" name="status" value="dikonfirmasi" />
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={pending} className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50">
        {pending ? t("confirming") : t("confirm")}
      </button>
    </form>
  );
}

export function RejectButton({ pemesananId }: { pemesananId: string }) {
  const t = useTranslations("ReservasiMasuk");
  const [state, formAction, pending] = useActionState(setPemesananStatusAction as never, null as FormState);
  return (
    <form action={formAction} className="inline">
      {hidden(pemesananId)}
      <input type="hidden" name="status" value="ditolak" />
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={pending} className="rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50">
        {pending ? t("rejecting") : t("reject")}
      </button>
    </form>
  );
}

export function CancelButton({ pemesananId }: { pemesananId: string }) {
  const t = useTranslations("Reservasi");
  const [state, formAction, pending] = useActionState(cancelPemesananAction as never, null as FormState);
  return (
    <form
      action={formAction}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm(t("cancelConfirm"))) e.preventDefault();
      }}
    >
      {hidden(pemesananId)}
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={pending} className="rounded-lg border border-error/40 px-3 py-1.5 text-[10px] font-semibold text-error hover:bg-error hover:text-white disabled:opacity-50">
        {pending ? t("cancelling") : t("cancel")}
      </button>
    </form>
  );
}
