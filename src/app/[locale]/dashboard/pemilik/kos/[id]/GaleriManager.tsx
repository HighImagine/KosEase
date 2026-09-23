"use client";
import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { deleteGaleriAction, uploadGaleriAction } from "@/app/[locale]/kos/actions";
import { useScrollToMessage } from "@/hooks/useScrollToMessage";
import UploadPopup, { toMB } from "@/components/UploadPopup";
import type { Galeri } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

const MAX_BYTES = 2 * 1024 * 1024; // 2MB, sama dengan batas server

function GaleriItem({ foto }: { foto: Galeri }) {
  const t = useTranslations("GaleriManager");
  const [state, formAction, pending] = useActionState(deleteGaleriAction as never, null as FormState);
  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <div className="relative h-28">
        <Image src={foto.image_url} alt={foto.caption ?? t("alt")} fill sizes="200px" className="object-cover" />
      </div>
      {foto.caption && <p className="truncate px-2 py-1 text-[10px] text-text-secondary">{foto.caption}</p>}
      <form action={formAction} className="px-2 pb-2">
        <input type="hidden" name="galeriId" value={foto.id} />
        {state?.error && <p className="mb-1 text-[10px] text-error">{state.error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-error/10 py-1.5 text-[10px] font-semibold text-error hover:bg-error hover:text-white disabled:opacity-50">
          {t("delete")}
        </button>
      </form>
    </div>
  );
}

export default function GaleriManager({ kosId, galeri }: { kosId: string; galeri: Galeri[] }) {
  const t = useTranslations("GaleriManager");
  const [state, formAction, pending] = useActionState(uploadGaleriAction as never, null as FormState);
  const fileRef = useRef<HTMLInputElement>(null);
  const [oversize, setOversize] = useState<{ name: string; sizeMB: string } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  useScrollToMessage(state, msgRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setOversize({ name: file.name, sizeMB: toMB(file.size) });
      e.target.value = ""; // batalkan pilihan agar tidak ikut ter-submit
      setFileName(null);
      return;
    }
    setFileName(file.name);
  };

  return (
    <div className="space-y-3">
      <form action={formAction} className="rounded-xl border border-border p-4">
        <div ref={msgRef}>
          {state?.error && <p className="mb-2 rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
          {state?.success && <p className="mb-2 rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
        </div>
        <input type="hidden" name="kosId" value={kosId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="block text-[10px] font-semibold text-text-primary">{t("photo")}</span>
            <input ref={fileRef} name="foto" type="file" accept="image/jpeg,image/png,image/webp" required onChange={handleFileChange} className="hidden" />
            {fileName && (
              <p className="mt-1.5 truncate text-[11px] font-semibold text-primary">📎 {fileName}</p>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-text-primary hover:border-primary hover:text-primary">
              {fileName ? t("changePhoto") : t("choosePhoto")}
            </button>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-primary">{t("caption")}</label>
            <input name="caption" placeholder={t("captionPh")} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary" />
          </div>
        </div>
        <button type="submit" disabled={pending} className="mt-3 rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
          {pending ? t("uploading") : t("upload")}
        </button>
      </form>

      <UploadPopup
        open={oversize !== null}
        fileName={oversize?.name ?? ""}
        sizeMB={oversize?.sizeMB ?? ""}
        maxMB={2}
        onClose={() => setOversize(null)}
      />

      {galeri.length === 0 ? (
        <p className="text-xs text-text-secondary">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {galeri.map((g) => (
            <GaleriItem key={g.id} foto={g} />
          ))}
        </div>
      )}
    </div>
  );
}
