"use client";
import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  cancelPemesananAction,
  setPemesananStatusAction,
} from "@/app/[locale]/pemesanan/actions";
import {
  ALASAN_PENOLAKAN_PRESETS,
  type AlasanPenolakanKey,
} from "@/lib/alasan-penolakan";

type FormState = { error?: string; success?: string } | null;

function hidden(id: string) {
  return <input type="hidden" name="pemesananId" value={id} />;
}

export function ConfirmButton({ pemesananId, stok }: { pemesananId: string; stok?: number }) {
  const t = useTranslations("ReservasiMasuk");
  const [state, formAction, pending] = useActionState(setPemesananStatusAction as never, null as FormState);
  const outOfStock = stok !== undefined && stok <= 0;
  const disabled = pending || outOfStock;
  return (
    <form action={formAction} className="inline">
      {hidden(pemesananId)}
      <input type="hidden" name="status" value="dikonfirmasi" />
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
      <button type="submit" disabled={disabled} className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50">
        {pending ? t("confirming") : outOfStock ? t("stockOut") : t("confirm")}
      </button>
    </form>
  );
}

const presetClass = (active: boolean) =>
  `flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors ${
    active
      ? "border-error bg-error/10 text-error"
      : "border-border bg-surface text-text-secondary hover:border-error/40 hover:text-text-primary"
  }`;

export function RejectButton({ pemesananId }: { pemesananId: string }) {
  const t = useTranslations("ReservasiMasuk");
  const ta = useTranslations("AlasanPenolakan");
  const [state, formAction, pending] = useActionState(setPemesananStatusAction as never, null as FormState);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AlasanPenolakanKey | null>(null);
  const [customReason, setCustomReason] = useState("");
  const isOther = selected === "lainnya";
  const canSubmit = selected !== null && (!isOther || customReason.trim().length > 0);

  // Esc menutup panel dan mereset pilihan (perilaku dialog standar).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || pending) return;
      setOpen(false);
      setSelected(null);
      setCustomReason("");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, pending]);

  const close = () => {
    setOpen(false);
    setSelected(null);
    setCustomReason("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
      >
        {t("reject")}
      </button>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-3">
      <input type="hidden" name="pemesananId" value={pemesananId} />
      <input type="hidden" name="status" value="ditolak" />
      <input type="hidden" name="alasanKey" value={selected ?? ""} />
      <input type="hidden" name="alasanCustom" value={isOther ? customReason.trim() : ""} />

      <div
        role="group"
        aria-label={ta("label")}
        className="rounded-xl border border-error/30 bg-error/5 p-4"
      >
        <p className="mb-3 text-xs font-semibold text-error">{ta("label")}</p>

        {/* Preset pilihan sebagai radio button cards */}
        <div className="flex flex-col gap-2">
          {ALASAN_PENOLAKAN_PRESETS.map((key) => {
            const isActive = selected === key;
            return (
              <label key={key} className={presetClass(isActive)}>
                <input
                  type="radio"
                  name="_rejectChoice"
                  value={key}
                  checked={isActive}
                  onChange={() => setSelected(key)}
                  disabled={pending}
                  className="mt-0.5 accent-error"
                />
                {ta(key)}
              </label>
            );
          })}

          {/* Opsi lainnya */}
          <label className={presetClass(isOther)}>
            <input
              type="radio"
              name="_rejectChoice"
              value="lainnya"
              checked={isOther}
              onChange={() => setSelected("lainnya")}
              disabled={pending}
              className="mt-0.5 accent-error"
            />
            {ta("lainnya")}
          </label>

          {isOther && (
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder={ta("customPlaceholder")}
              maxLength={200}
              required
              disabled={pending}
              autoFocus
              className="rounded-lg border border-error/40 bg-surface px-3 py-2 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-error"
            />
          )}
        </div>

        {state?.error && <p className="mt-2 text-[11px] text-error">{state.error}</p>}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={close}
          disabled={pending}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-background disabled:opacity-50"
        >
          {t("rejectCancel")}
        </button>
        <button
          type="submit"
          disabled={pending || !canSubmit}
          className="rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        >
          {pending ? t("rejecting") : t("rejectConfirm")}
        </button>
      </div>
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
