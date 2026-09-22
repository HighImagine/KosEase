"use client";
import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteKamarAction, upsertKamarAction } from "@/app/[locale]/kos/actions";
import { formatHarga } from "@/lib/format";
import type { Kamar } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary";
const labelCls = "block text-[10px] font-semibold text-text-primary";

function KamarRow({ kosId, kamar }: { kosId: string; kamar: Kamar }) {
  const t = useTranslations("KamarManager");
  const [open, setOpen] = useState(false);
  const [editState, editAction, editPending] = useActionState(upsertKamarAction as never, null as FormState);
  const [delState, delAction, delPending] = useActionState(deleteKamarAction as never, null as FormState);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">{kamar.nama}</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">
            {kamar.ukuran ?? "-"} · {formatHarga(kamar.harga)}/bln · stok {kamar.stok} · {kamar.ketersediaan === "Tersedia" ? t("available") : t("unavailable")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary">
            {open ? t("close") : t("edit")}
          </button>
          <form action={delAction} className="inline">
            <input type="hidden" name="kosId" value={kosId} />
            <input type="hidden" name="kamarId" value={kamar.id} />
            <button type="submit" disabled={delPending} className="rounded-lg bg-error/10 px-3 py-1.5 text-[10px] font-semibold text-error hover:bg-error hover:text-white disabled:opacity-50">
              {t("delete")}
            </button>
          </form>
        </div>
      </div>
      {delState?.error && <p className="mt-2 text-[11px] text-error">{delState.error}</p>}
      {delState?.success && <p className="mt-2 text-[11px] text-success">{delState.success}</p>}

      {open && (
        <form action={editAction} className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
          {editState?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error sm:col-span-2">{editState.error}</p>}
          {editState?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success sm:col-span-2">{editState.success}</p>}
          <input type="hidden" name="kosId" value={kosId} />
          <input type="hidden" name="kamarId" value={kamar.id} />
          <div>
            <label className={labelCls}>{t("name")}</label>
            <input name="nama" required defaultValue={kamar.nama} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("size")}</label>
            <input name="ukuran" defaultValue={kamar.ukuran ?? ""} placeholder={t("sizePh")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("price")}</label>
            <input name="harga" type="number" min={0} step={50000} required defaultValue={kamar.harga} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("stock")}</label>
            <input name="stok" type="number" min={0} required defaultValue={kamar.stok} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>{t("desc")}</label>
            <textarea name="deskripsi" rows={2} defaultValue={kamar.deskripsi ?? ""} className={`${inputCls} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={editPending} className="rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
              {editPending ? t("saving") : t("saveKamar")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function KamarManager({ kosId, kamar }: { kosId: string; kamar: Kamar[] }) {
  const t = useTranslations("KamarManager");
  const [adding, setAdding] = useState(kamar.length === 0);
  const [state, formAction, pending] = useActionState(upsertKamarAction as never, null as FormState);

  return (
    <div className="space-y-3">
      {kamar.map((k) => (
        <KamarRow key={k.id} kosId={kosId} kamar={k} />
      ))}

      {!adding ? (
        <button type="button" onClick={() => setAdding(true)} className="w-full rounded-xl border border-dashed border-border px-4 py-3 text-xs font-semibold text-text-secondary hover:border-primary hover:text-primary">
          {t("add")}
        </button>
      ) : (
        <form action={formAction} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
          {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error sm:col-span-2">{state.error}</p>}
          {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success sm:col-span-2">{state.success}</p>}
          <input type="hidden" name="kosId" value={kosId} />
          <div>
            <label className={labelCls}>{t("name")}</label>
            <input name="nama" required placeholder={t("namePh")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("size")}</label>
            <input name="ukuran" placeholder={t("sizePh")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("price")}</label>
            <input name="harga" type="number" min={0} step={50000} required placeholder={t("pricePh")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("stock")}</label>
            <input name="stok" type="number" min={0} required placeholder={t("stockPh")} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>{t("desc")}</label>
            <textarea name="deskripsi" rows={2} placeholder={t("descPh")} className={`${inputCls} resize-none`} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={pending} className="rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
              {pending ? t("saving") : t("addBtn")}
            </button>
            {kamar.length > 0 && (
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold text-text-secondary">
                {t("cancel")}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
