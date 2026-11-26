"use client";
import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IconUsersGroup } from "@tabler/icons-react";
import { setKosAturanAction } from "@/app/[locale]/kos/actions";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";
import {
  ATURAN_LIST,
  MAKS_PENGHUNI_MAX,
  MAKS_PENGHUNI_MIN,
  type AturanItem,
} from "@/lib/aturan";
import type { AturanKos } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

export default function AturanManager({
  kosId,
  selected,
  maksPenghuni,
}: {
  kosId: string;
  selected: AturanKos[];
  maksPenghuni: number | null;
}) {
  const t = useTranslations("AturanKos");
  const [state, formAction, pending] = useActionState(setKosAturanAction as never, null as FormState);
  const msgRef = useRef<HTMLDivElement>(null);
  useScrollToMessage(state, msgRef);
  const [aturan, setAturan] = useState<AturanKos[]>(selected);

  const toggle = (item: AturanItem, checked: boolean) => {
    setAturan((prev) => {
      let next = checked ? [...prev, item.key] : prev.filter((key) => key !== item.key);
      if (checked && item.conflictsWith) {
        next = next.filter((key) => key !== item.conflictsWith);
      }
      return [...new Set(next)];
    });
  };

  return (
    <form action={formAction} className="space-y-4">
      <div ref={msgRef}>
        {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
        {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
      </div>
      <input type="hidden" name="kosId" value={kosId} />

      <div className="space-y-2">
        {ATURAN_LIST.map((item) => {
          const Icon = item.icon;
          return (
            <label
              key={item.key}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-primary has-checked:border-primary has-checked:bg-primary-light"
            >
              <input
                type="checkbox"
                name="aturan"
                value={item.key}
                checked={aturan.includes(item.key)}
                onChange={(e) => toggle(item, e.target.checked)}
                className="accent-primary"
              />
              <Icon size={15} stroke={1.8} className="shrink-0" />
              {t(item.labelKey)}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <IconUsersGroup size={16} stroke={1.8} className="text-primary" />
        <label htmlFor="maks_penghuni" className="text-xs font-semibold text-text-primary">
          {t("maksPenghuni")}
        </label>
        <input
          id="maks_penghuni"
          name="maks_penghuni"
          type="number"
          min={MAKS_PENGHUNI_MIN}
          max={MAKS_PENGHUNI_MAX}
          defaultValue={maksPenghuni ?? ""}
          placeholder="1"
          className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary"
        />
        <span className="text-xs text-text-secondary">{t("maksPenghuniSuffix")}</span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? t("saving") : t("save")}
      </button>
    </form>
  );
}
