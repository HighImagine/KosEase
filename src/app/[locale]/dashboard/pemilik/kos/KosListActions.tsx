"use client";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { deleteKosAction, setPublikasiAction } from "@/app/[locale]/kos/actions";
import type { StatusPublikasi } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

export function PublikasiToggle({ kosId, status }: { kosId: string; status: StatusPublikasi }) {
  const t = useTranslations("KelolaKos");
  const [state, formAction, pending] = useActionState(setPublikasiAction as never, null as FormState);
  const next = status === "tayang" ? "draft" : "tayang";
  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="kosId" value={kosId} />
      <input type="hidden" name="status" value={next} />
      {state?.error && <span className="mr-2 text-[10px] text-error">{state.error}</span>}
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
