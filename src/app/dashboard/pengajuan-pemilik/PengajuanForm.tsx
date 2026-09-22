"use client";
import { useActionState, useRef, useState } from "react";
import { pengajuanPemilikAction, type PengajuanValues } from "@/app/(auth)/actions";
import UploadPopup, { toMB } from "@/components/UploadPopup";

const DOKUMEN_MAX_BYTES = 10 * 1024 * 1024; // 10MB, sama dengan batas server

type FormState = { error?: string; values?: PengajuanValues } | null;

const EMPTY: PengajuanValues = { nama: "", phone: "", alamat: "", alasan: "", info_kos: "" };

const labelCls = "text-xs font-semibold text-text-primary";
const inputCls =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary";
const areaCls =
  "mt-2 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary";

export default function PengajuanForm() {
  const [state, formAction, pending] = useActionState(pengajuanPemilikAction as never, null as FormState);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [oversize, setOversize] = useState<{ name: string; sizeMB: string } | null>(null);

  const handleDokumenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.size > DOKUMEN_MAX_BYTES) {
      setOversize({ name: file.name, sizeMB: toMB(file.size) });
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  };
  // Controlled: state hidup di client dan tidak di-reset saat action
  // mengembalikan error, jadi isian user tetap ada.
  const [vals, setVals] = useState<PengajuanValues>(EMPTY);
  const set = (key: keyof PengajuanValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setVals((v) => ({ ...v, [key]: e.target.value }));

  return (
    <form action={formAction} className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        {state?.error && (
          <p className="mb-4 rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>
        )}
        <div>
          <label className={labelCls}>Nama Lengkap Sesuai KTP</label>
          <input name="nama" type="text" required value={vals.nama} onChange={set("nama")} placeholder="Andi Pratama" className={inputCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Nomor WhatsApp Aktif</label>
          <input name="phone" type="text" required value={vals.phone} onChange={set("phone")} placeholder="081234567890" className={inputCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Alamat Lengkap Pemilik</label>
          <textarea name="alamat" required value={vals.alamat} onChange={set("alamat")} placeholder="Tuliskan alamat rumah tinggal Anda saat ini dengan detail (Kelurahan, Kecamatan, Kota, Kode Pos)" rows={3} className={areaCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Alasan Mengajukan Diri Menjadi Pemilik</label>
          <textarea name="alasan" required value={vals.alasan} onChange={set("alasan")} placeholder="Ceritakan singkat motivasi Anda mendaftar program mitra KosEase" rows={3} className={areaCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Informasi Detail Unit Kos yang Akan Didaftarkan</label>
          <textarea name="info_kos" required value={vals.info_kos} onChange={set("info_kos")} placeholder="Sebutkan nama rencana kos, lokasi jalan, jumlah total kamar, tipe kamar, serta kelengkapan fasilitas awal" rows={3} className={areaCls} />
        </div>
        <div className="mt-4">
          <label className={labelCls}>Upload Dokumen Pendukung (KTP & Sertifikat Kepemilikan)</label>
          <div className="mt-2 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-5 text-center">
            <p className="text-2xl text-primary">♧</p>
            <p className="mt-2 text-xs font-semibold text-text-primary">Pilih dokumen atau tarik file ke sini</p>
            <p className="mt-1 text-[10px] text-text-secondary">Format file PDF, JPG, PNG (Maksimal 10MB)</p>
            <input
              ref={fileRef}
              name="dokumen"
              type="file"
              accept=".pdf,.jpg,.png,.jpeg"
              className="hidden"
              id="dokumen-input"
              onChange={handleDokumenChange}
            />
            {fileName && (
              <p className="mt-2 truncate text-[11px] font-semibold text-primary">📎 {fileName}</p>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
              {fileName ? "Ganti Berkas" : "Pilih Berkas"}
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
            {pending ? "Mengirim..." : "Ajukan Menjadi Pemilik Kos"}
          </button>
          <button type="button" className="rounded-lg border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-text-primary hover:text-primary">Batal</button>
        </div>
      </div>

      <UploadPopup
        open={oversize !== null}
        fileName={oversize?.name ?? ""}
        sizeMB={oversize?.sizeMB ?? ""}
        maxMB={10}
        onClose={() => setOversize(null)}
      />
    </form>
  );
}
