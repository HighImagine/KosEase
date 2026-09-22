import { pengajuanPemilikAction } from "@/app/(auth)/actions";
import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUser from "@/components/DashboardSidebarUser";

export default function PengajuanPemilik() {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUser userRole="Pengguna" />

            <div className="flex flex-1 flex-col">
<DashboardNavbar title="Ajukan Diri sebagai Pemilik Kos" />

                <main className="flex-1 p-6">
                    <div className="rounded-xl border border-primary-light bg-primary-light p-5">
                        <div className="flex gap-4">
                            <Image src="/img/favicon.png" alt="" width={32} height={32} />
                            <div>
                                <h2 className="text-sm font-bold text-primary">Langkah Mudah Menjadi Pemilik Kos</h2>
                                <p className="mt-1 text-xs leading-relaxed text-text-secondary">Ingin mendaftarkan kos Anda di KosEase? Isi formulir di bawah ini untuk mengajukan diri sebagai Pemilik Kos!</p>
                            </div>
                        </div>
                    </div>

                    <form action={pengajuanPemilikAction as any} className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
                        <div>
                            <div>
                                <label className="text-xs font-semibold text-text-primary">Nama Lengkap Sesuai KTP</label>
                                <input name="nama" type="text" required placeholder="Andi Pratama" className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-text-primary">Nomor WhatsApp Aktif</label>
                                <input name="phone" type="text" required placeholder="081234567890" className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-text-primary">Alamat Lengkap Pemilik</label>
                                <textarea name="alamat" required placeholder="Tuliskan alamat rumah tinggal Anda saat ini dengan detail (Kelurahan, Kecamatan, Kota, Kode Pos)" rows={3} className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-text-primary">Alasan Mengajukan Diri Menjadi Pemilik</label>
                                <textarea name="alasan" required placeholder="Ceritakan singkat motivasi Anda mendaftar program mitra KosEase" rows={3} className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-text-primary">Informasi Detail Unit Kos yang Akan Didaftarkan</label>
                                <textarea name="info_kos" required placeholder="Sebutkan nama rencana kos, lokasi jalan, jumlah total kamar, tipe kamar, serta kelengkapan fasilitas awal" rows={3} className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary" />
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-text-primary">Upload Dokumen Pendukung (KTP & Sertifikat Kepemilikan)</label>
                                <div className="mt-2 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-5 text-center">
                                    <p className="text-2xl text-primary">♧</p>
                                    <p className="mt-2 text-xs font-semibold text-text-primary">Pilih dokumen atau tarik file ke sini</p>
                                    <p className="mt-1 text-[10px] text-text-secondary">Format file PDF, JPG, PNG (Maksimal 10MB)</p>
                                    <input name="dokumen" type="file" accept=".pdf,.jpg,.png" className="mt-2 hidden" id="dokumen-input" />
                                    <button type="button" className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">Pilih Berkas</button>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-dark">Ajukan Menjadi Pemilik Kos</button>
                                <button type="button" className="rounded-lg border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-text-primary hover:text-primary">Batal</button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
