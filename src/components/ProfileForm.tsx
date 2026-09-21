"use client";
import { useActionState, useRef } from "react";
import { updateProfileAction } from "@/app/(auth)/actions";
import Image from "next/image";
import { IconUser, IconPhoto } from "@tabler/icons-react";

type InitialValues = {
    currentName?: string;
    currentEmail?: string;
    currentPhone?: string;
    currentAvatar?: string | null;
};

export default function ProfileForm({ initialValues }: { initialValues: InitialValues }) {
  const [state, formAction, pending] = useActionState(updateProfileAction as never, null as unknown as { error?: string; success?: string; currentName?: string; currentEmail?: string; currentPhone?: string; currentAvatar?: string | null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const v = state ?? initialValues;

  return (
    <form action={formAction} className="mt-5 space-y-4">
      {state?.error && <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>}
      {state?.success && <p className="rounded-md bg-success/10 px-3 py-2 text-xs text-success">{state.success}</p>}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface border border-border">
          {state?.currentAvatar ? (
            <Image src={state.currentAvatar} alt="Avatar" fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background">
              <IconUser size={32} stroke={2} color="#4b5563" />
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-text-primary">Foto Profil</p>
          <p className="mt-0.5 text-[10px] text-text-secondary">JPG, PNG, maks 2MB</p>
          <input ref={fileInputRef} name="avatar" type="file" accept="image/jpeg,image/png" className="mt-1 hidden" id="avatar-input" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark transition-colors">
            <IconPhoto size={12} stroke={2} color="#ffffff" />
            Ganti Foto
          </button>
        </div>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label htmlFor="nama" className="block text-[10px] font-semibold text-text-primary">Nama Lengkap</label>
        <input id="nama" name="nama" type="text" required defaultValue={v.currentName ?? ""} placeholder="Masukkan nama lengkap Anda" className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>

      {/* Email (read-only) */}
      <div>
        <label htmlFor="email" className="block text-[10px] font-semibold text-text-primary">Alamat Email</label>
        <input id="email" name="email" type="email" required defaultValue={v.currentEmail ?? ""} disabled className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-text-secondary outline-none cursor-not-allowed" />
      </div>

      {/* Nomor Telepon */}
      <div>
        <label htmlFor="phone" className="block text-[10px] font-semibold text-text-primary">Nomor Telepon</label>
        <input id="phone" name="phone" type="tel" defaultValue={v.currentPhone ?? ""} placeholder="081234567890" className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
      </div>

      <button type="submit" disabled={pending} className="mt-3 flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
