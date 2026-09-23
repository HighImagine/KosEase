"use client";
import { useActionState, useRef } from "react";
import { useTranslations } from "next-intl";
import { setKosFasilitasAction } from "@/app/[locale]/kos/actions";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";

type FormState = { error?: string; success?: string } | null;

export default function FasilitasPicker({
  kosId,
  master,
  selected,
}: {
  kosId: string;
  master: { id: string; nama: string }[];
  selected: string[]; // nama fasilitas yang sedang terpasang
}) {
  const t = useTranslations("FasilitasPicker");
  const [state, formAction, pending] = useActionState(setKosFasilitasAction as never, null as FormState);
  const msgRef = useRef<HTMLDivElement>(null);
  useScrollToMessage(state, msgRef);

  if (master.length === 0) {
    return <p className="text-xs text-text-secondary">{t("empty")}</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <div ref={msgRef}>
        {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
        {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
      </div>
      <input type="hidden" name="kosId" value={kosId} />
      <div className="flex flex-wrap gap-2">
        {master.map((f) => (
          <label key={f.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-text-primary has-checked:border-primary has-checked:bg-primary-light">
            <input type="checkbox" name="fasilitasId" value={f.id} defaultChecked={selected.includes(f.nama)} className="accent-primary" />
            {f.nama}
          </label>
        ))}
      </div>
      <button type="submit" disabled={pending} className="rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
        {pending ? t("saving") : t("save")}
      </button>
    </form>
  );
}
