"use client";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Kos } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;
type KosAction = (_prev: unknown, formData: FormData) => Promise<FormState>;

const inputCls =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary";
const labelCls = "block text-[10px] font-semibold text-text-primary";

export default function KosForm({ kos, action }: { kos?: Kos | null; action: KosAction }) {
  const t = useTranslations("KosForm");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(action as never, null as FormState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
      {kos && <input type="hidden" name="kosId" value={kos.id_kos} />}
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label htmlFor="nama" className={labelCls}>{t("name")}</label>
        <input id="nama" name="nama" required defaultValue={kos?.nama ?? ""} placeholder={t("namePh")} className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tipe" className={labelCls}>{t("type")}</label>
          <select id="tipe" name="tipe" defaultValue={kos?.tipe ?? "Campur"} className={inputCls}>
            <option value="Campur">Campur</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div>
          <label htmlFor="lokasi" className={labelCls}>{t("location")}</label>
          <input id="lokasi" name="lokasi" required defaultValue={kos?.lokasi ?? ""} placeholder={t("locationPh")} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="alamat" className={labelCls}>{t("address")}</label>
        <input id="alamat" name="alamat" required defaultValue={kos?.alamat ?? ""} placeholder={t("addressPh")} className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="harga" className={labelCls}>{t("price")}</label>
          <input id="harga" name="harga" type="number" min={0} step={50000} required defaultValue={kos?.harga ?? 0} className={inputCls} />
          <p className="mt-1 text-[10px] text-text-secondary">{t("priceHint")}</p>
        </div>
        <div>
          <label htmlFor="status_publikasi" className={labelCls}>{t("status")}</label>
          <select id="status_publikasi" name="status_publikasi" defaultValue={kos?.status_publikasi ?? "draft"} className={inputCls}>
            <option value="draft">{t("draftOpt")}</option>
            <option value="tayang">{t("tayangOpt")}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="deskripsi" className={labelCls}>{t("desc")}</label>
        <textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={kos?.deskripsi ?? ""} placeholder={t("descPh")} className={`${inputCls} resize-none`} />
      </div>

      <button type="submit" disabled={pending} className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? t("saving") : kos ? t("save") : t("create")}
      </button>
    </form>
  );
}
