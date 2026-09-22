"use client";
import { useActionState, useRef } from "react";
import Image from "next/image";
import { deleteGaleriAction, uploadGaleriAction } from "@/app/kos/actions";
import type { Galeri } from "@/lib/db/types";

type FormState = { error?: string; success?: string } | null;

function GaleriItem({ foto }: { foto: Galeri }) {
  const [state, formAction, pending] = useActionState(deleteGaleriAction as never, null as FormState);
  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <div className="relative h-28">
        <Image src={foto.image_url} alt={foto.caption ?? "Foto kos"} fill sizes="200px" className="object-cover" />
      </div>
      {foto.caption && <p className="truncate px-2 py-1 text-[10px] text-text-secondary">{foto.caption}</p>}
      <form action={formAction} className="px-2 pb-2">
        <input type="hidden" name="galeriId" value={foto.id} />
        {state?.error && <p className="mb-1 text-[10px] text-error">{state.error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-error/10 py-1.5 text-[10px] font-semibold text-error hover:bg-error hover:text-white disabled:opacity-50">
          Hapus
        </button>
      </form>
    </div>
  );
}

export default function GaleriManager({ kosId, galeri }: { kosId: string; galeri: Galeri[] }) {
  const [state, formAction, pending] = useActionState(uploadGaleriAction as never, null as FormState);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <form action={formAction} className="rounded-xl border border-border p-4">
        {state?.error && <p className="mb-2 rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
        {state?.success && <p className="mb-2 rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}
        <input type="hidden" name="kosId" value={kosId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="block text-[10px] font-semibold text-text-primary">Foto (JPG/PNG/WebP, maks 2MB)</span>
            <input ref={fileRef} name="foto" type="file" accept="image/jpeg,image/png,image/webp" required className="mt-1 w-full text-xs text-text-secondary" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-primary">Caption (opsional)</label>
            <input name="caption" placeholder="Tampak depan kos" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary" />
          </div>
        </div>
        <button type="submit" disabled={pending} className="mt-3 rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
          {pending ? "Mengunggah..." : "Upload Foto"}
        </button>
      </form>

      {galeri.length === 0 ? (
        <p className="text-xs text-text-secondary">Belum ada foto. Foto pertama menjadi sampul kos.</p>
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
