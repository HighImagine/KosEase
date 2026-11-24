"use client";

import { useActionState } from "react";
import { createPengajuanPerpanjanganAction } from "@/app/[locale]/pemesanan/extension-actions";

export default function PerpanjanganForm({ pemesananId }: { pemesananId: string }) {
  const [state, action, pending] = useActionState(createPengajuanPerpanjanganAction as never, null as { error?: string; success?: string } | null);
  return <form action={action} className="mt-3 flex items-center gap-2 border-t border-border pt-3"><input type="hidden" name="pemesananId" value={pemesananId} /><select name="tambahanBulan" defaultValue="3" className="rounded border border-border px-2 py-1 text-xs"><option value="1">+1 bulan</option><option value="3">+3 bulan</option><option value="6">+6 bulan</option><option value="12">+12 bulan</option></select><button disabled={pending} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{pending ? "Mengirim..." : "Ajukan Perpanjangan"}</button>{state?.error && <span className="text-xs text-error">{state.error}</span>}{state?.success && <span className="text-xs text-success">{state.success}</span>}</form>;
}
