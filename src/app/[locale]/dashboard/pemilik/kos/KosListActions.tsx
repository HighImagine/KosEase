"use client";
import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import { ajukanPenarikanAction, deleteKosAction, setPublikasiAction } from "@/app/[locale]/kos/actions";
import type { StatusPublikasi } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

export function PublikasiToggle({ kosId, status }: { kosId: string; status: StatusPublikasi }) {
  const t = useTranslations("KelolaKos");
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const action = async (_prev: unknown, formData: FormData) => {
    setDismissedFor(null);
    return await setPublikasiAction(_prev, formData);
  };
  const [state, formAction, pending] = useActionState(action as never, null as FormState);
  const error = state?.error ?? null;
  const next = status === "tayang" ? "draft" : "tayang";
  return (
    <>
      <form action={formAction} className="inline">
        <input type="hidden" name="kosId" value={kosId} />
        <input type="hidden" name="status" value={next} />
        <button
          type="submit"
          disabled={pending}
          className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50 ${
            status === "tayang" ? "bg-warning hover:bg-yellow-600" : "bg-success hover:bg-green-600"
          }`}
        >
          {status === "tayang" ? t("toDraft") : t("toTayang")}
        </button>
      </form>
      {error && dismissedFor !== error && <Modal open message={error} onClose={() => setDismissedFor(error)} />}
    </>
  );
}

// Tombol "Ajukan Penarikan" untuk kos tayang milik pemilik. Alasan dikirim ke
// admin; status kos baru berubah ke draft setelah admin menyetujui.
export function AjukanPenarikanButton({ kosId, alasan }: { kosId: string; alasan?: string | null }) {
  const t = useTranslations("KelolaKos");
  const [open, setOpen] = useState(false);

  if (alasan) {
    return (
      <span
        title={alasan}
        className="rounded-lg bg-warning/10 px-3 py-1.5 text-[10px] font-semibold text-warning"
      >
        {t("withdrawPending")}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-warning px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-yellow-600"
      >
        {t("withdraw")}
      </button>
      {open && <PenarikanDialog kosId={kosId} onClose={() => setOpen(false)} />}
    </>
  );
}

function PenarikanDialog({ kosId, onClose }: { kosId: string; onClose: () => void }) {
  const t = useTranslations("KelolaKos");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(ajukanPenarikanAction as never, null as FormState);
  const error = state?.error ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("withdrawTitle")}
    >
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">
        <h3 className="font-heading text-base font-bold text-text-primary">{t("withdrawTitle")}</h3>
        <p className="mt-1 text-xs text-text-secondary">{t("withdrawDesc")}</p>
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="kosId" value={kosId} />
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label htmlFor="alasan" className="block text-[10px] font-semibold text-text-primary">
              {t("withdrawReason")}
            </label>
            <textarea
              id="alasan"
              name="alasan"
              rows={4}
              required
              minLength={5}
              maxLength={1000}
              placeholder={t("withdrawPlaceholder")}
              className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
            />
          </div>
          {error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{error}</p>}
          {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary"
            >
              {tc("cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-warning px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              {pending ? t("withdrawSending") : t("withdrawSubmit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteKosButton({ kosId }: { kosId: string }) {
  const t = useTranslations("KelolaKos");
  const locale = useLocale();
  return (
    <form
      // Bungkus agar cocok dengan tipe form action 1-argumen (tanpa `as any`).
      action={async (formData: FormData) => {
        await deleteKosAction(null, formData);
      }}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm(t("deleteConfirm"))) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="kosId" value={kosId} />
      <input type="hidden" name="locale" value={locale} />
      <button type="submit" className="rounded-lg bg-error px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-red-600">
        {t("delete")}
      </button>
    </form>
  );
}
