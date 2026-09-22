"use client";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  fileName: string;
  sizeMB: string;
  maxMB: number;
  onClose: () => void;
};

// Popup peringatan ukuran file (validasi sisi client, sebelum submit).
export default function UploadPopup({ open, fileName, sizeMB, maxMB, onClose }: Props) {
  const t = useTranslations("UploadPopup");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={t("title")}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-2xl">⚠️</p>
        <h3 className="mt-3 font-heading text-base font-bold text-text-primary">{t("title")}</h3>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          {t("message", { name: fileName, size: sizeMB, max: maxMB })}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
}

export function toMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2);
}
