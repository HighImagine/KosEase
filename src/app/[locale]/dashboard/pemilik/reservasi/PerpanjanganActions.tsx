"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { decidePengajuanPerpanjanganAction } from "@/app/[locale]/pemesanan/extension-actions";

export function ExtensionDecision({ id }: { id: string }) {
  const t = useTranslations("ReservasiMasuk");
  const [state, action, pending] = useActionState(decidePengajuanPerpanjanganAction as never, null as { error?: string; success?: string } | null);
  return <form action={action} className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3"><input type="hidden" name="pengajuanId" value={id} /><input name="alasanTolak" maxLength={200} placeholder={t("extensionRejectReason")} className="min-w-0 flex-1 rounded border border-border px-3 py-1.5 text-xs" /><button name="decision" value="setujui" disabled={pending} className="rounded bg-success px-3 py-1.5 text-xs font-semibold text-white">Setujui</button><button name="decision" value="tolak" disabled={pending} className="rounded bg-error px-3 py-1.5 text-xs font-semibold text-white">Tolak</button><button name="decision" value="setujui_batalkan" disabled={pending} className="rounded border border-border px-3 py-1.5 text-xs font-semibold">Setujui & batalkan klaim waitlist</button>{state?.error && <span className="basis-full text-xs text-error">{state.error}</span>}{state?.success && <span className="basis-full text-xs text-success">{state.success}</span>}</form>;
}
