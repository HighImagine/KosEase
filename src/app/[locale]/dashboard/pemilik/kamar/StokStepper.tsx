"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { adjustKamarStokAction } from "@/app/[locale]/kos/actions";
import { IconMinus, IconPlus } from "@tabler/icons-react";

type Props = {
  kosId: string;
  kamarId: string;
  stok: number;
};

export default function StokStepper({ kosId, kamarId, stok }: Props) {
  const t = useTranslations("KamarList");
  const router = useRouter();
  const [value, addOptimistic] = useOptimistic(stok, (current, delta: number) =>
    Math.max(0, current + delta)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const adjust = (delta: number) => {
    if (pending) return;
    if (delta < 0 && value <= 0) return;
    setError(null);
    startTransition(async () => {
      addOptimistic(delta);
      const fd = new FormData();
      fd.set("kosId", kosId);
      fd.set("kamarId", kamarId);
      fd.set("delta", String(delta));
      const res = await adjustKamarStokAction(null, fd);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => adjust(-1)}
        disabled={pending || value <= 0}
        aria-label={t("decrease")}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconMinus size={12} stroke={2.5} />
      </button>
      <span className="min-w-6 text-center text-xs font-semibold text-text-primary">{value}</span>
      <button
        type="button"
        onClick={() => adjust(1)}
        disabled={pending}
        aria-label={t("increase")}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-secondary hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconPlus size={12} stroke={2.5} />
      </button>
      {error && <span className="max-w-40 text-[10px] text-error">{error}</span>}
    </div>
  );
}
