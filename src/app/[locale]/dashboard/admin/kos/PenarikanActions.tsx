"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import { prosesPenarikanAction } from "@/app/[locale]/kos/actions";

type FormState = { error?: string; success?: string } | null;

export default function PenarikanActions({ penarikanId, kosId }: { penarikanId: string; kosId: string }) {
  const t = useTranslations("AdminKos");
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const action = async (_prev: unknown, formData: FormData) => {
    setDismissedFor(null);
    return await prosesPenarikanAction(_prev, formData);
  };
  const [state, formAction, pending] = useActionState(action as never, null as FormState);
  const error = state?.error ?? null;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        <form action={formAction}>
          <input type="hidden" name="penarikanId" value={penarikanId} />
          <input type="hidden" name="kosId" value={kosId} />
          <input type="hidden" name="aksi" value="setujui" />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-warning px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            {t("approveWithdraw")}
          </button>
        </form>
        <form action={formAction}>
          <input type="hidden" name="penarikanId" value={penarikanId} />
          <input type="hidden" name="kosId" value={kosId} />
          <input type="hidden" name="aksi" value="tolak" />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary disabled:opacity-50"
          >
            {t("rejectWithdraw")}
          </button>
        </form>
      </div>
      {error && dismissedFor !== error && <Modal open message={error} onClose={() => setDismissedFor(error)} />}
    </>
  );
}
