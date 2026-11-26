"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteKamarAction } from "@/app/[locale]/kos/actions";
import type { KamarMilik } from "@/lib/db/queries";

type FormState = { error?: string; success?: string } | null;

type Props = {
  kamar: KamarMilik;
  onClose: () => void;
};

export default function DeleteKamarDialog({ kamar, onClose }: Props) {
  const t = useTranslations("KamarList");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [state, formAction, pending] = useActionState<FormState, FormData>(deleteKamarAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pending, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("deleteTitle")}
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
        <h3 className="font-heading text-base font-bold text-text-primary">{t("deleteTitle")}</h3>
        <p className="mt-2 text-sm text-text-secondary">{t("deleteDesc", { nama: kamar.nama })}</p>

        <form action={formAction} className="mt-5">
          <input type="hidden" name="kosId" value={kamar.kos_id} />
          <input type="hidden" name="kamarId" value={kamar.id} />
          {state?.error && (
            <p className="mb-3 rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary disabled:opacity-50"
            >
              {tc("cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-error px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-error/90 disabled:opacity-50"
            >
              {pending ? t("deleting") : t("deleteConfirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
