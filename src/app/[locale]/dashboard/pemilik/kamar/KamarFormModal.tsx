"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { upsertKamarAction } from "@/app/[locale]/kos/actions";
import type { KamarMilik } from "@/lib/db/queries";
import type { Kos } from "@/lib/db/types";
import { IconX } from "@tabler/icons-react";

type FormState = { error?: string; success?: string } | null;

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary";
const labelCls = "block text-[10px] font-semibold text-text-primary";

type Props = {
  kosList: Kos[];
  kamar: KamarMilik | null;
  defaultKosId?: string;
  onClose: () => void;
};

export default function KamarFormModal({ kosList, kamar, defaultKosId, onClose }: Props) {
  const t = useTranslations("KamarManager");
  const router = useRouter();
  const [state, formAction, pending] = useActionState<FormState, FormData>(upsertKamarAction, null);
  const [kosId, setKosId] = useState(kamar?.kos_id ?? defaultKosId ?? kosList[0]?.id_kos ?? "");
  const lockedKos = !!kamar || !!defaultKosId;

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={kamar ? t("editTitle") : t("addTitle")}
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary">
              {kamar ? t("editTitle") : t("addTitle")}
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              {kamar ? t("editDesc") : t("addDesc")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label={t("close")}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-primary-light hover:text-primary disabled:opacity-50"
          >
            <IconX size={16} stroke={2} />
          </button>
        </div>

        <form action={formAction} className="grid gap-3 sm:grid-cols-2">
          {state?.error && (
            <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error sm:col-span-2">{state.error}</p>
          )}

          {kamar ? (
            <>
              <input type="hidden" name="kosId" value={kamar.kos_id} />
              <input type="hidden" name="kamarId" value={kamar.id} />
            </>
          ) : (
            <div className="sm:col-span-2">
              <label className={labelCls}>{t("chooseKos")}</label>
              {lockedKos ? (
                <>
                  <input type="hidden" name="kosId" value={kosId} />
                  <p className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary">
                    {kosList.find((k) => k.id_kos === kosId)?.nama ?? "-"}
                  </p>
                </>
              ) : (
                <select
                  name="kosId"
                  required
                  value={kosId}
                  onChange={(e) => setKosId(e.target.value)}
                  className={inputCls}
                >
                  {kosList.map((k) => (
                    <option key={k.id_kos} value={k.id_kos}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className={labelCls}>{t("name")}</label>
            <input
              name="nama"
              required
              autoFocus
              defaultValue={kamar?.nama ?? ""}
              placeholder={t("namePh")}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t("size")}</label>
            <input
              name="ukuran"
              defaultValue={kamar?.ukuran ?? ""}
              placeholder={t("sizePh")}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t("price")}</label>
            <input
              name="harga"
              type="number"
              min={0}
              step={50000}
              required
              defaultValue={kamar?.harga ?? ""}
              placeholder={t("pricePh")}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t("stock")}</label>
            <input
              name="stok"
              type="number"
              min={0}
              required
              defaultValue={kamar?.stok ?? ""}
              placeholder={t("stockPh")}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>{t("desc")}</label>
            <textarea
              name="deskripsi"
              rows={3}
              defaultValue={kamar?.deskripsi ?? ""}
              placeholder={t("descPh")}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold text-text-secondary hover:text-primary disabled:opacity-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {pending ? t("saving") : t("saveKamar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
