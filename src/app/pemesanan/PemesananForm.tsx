"use client";
import { useState, useMemo } from "react";
import { formatHarga } from "@/lib/format";
import Link from "next/link";

type Props = {
    kos: {
        id: string;
        nama: string;
        kamar: { nama: string; ukuran: string | null; harga: number; ketersediaan: string; stok: number; deskripsi: string | null }[];
    } | null;
};

export default function PemesananForm({ kos }: Props) {
    const availableKamar = kos?.kamar.filter((k) => k.ketersediaan === "Tersedia") ?? [];
    const [selectedKamar, setSelectedKamar] = useState<string>(availableKamar[0]?.nama ?? "");
    const [nama, setNama] = useState("");
    const [wa, setWa] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [durasi, setDurasi] = useState(3);
    const [catatan, setCatatan] = useState("");

    const selected = kos?.kamar.find((k) => k.nama === selectedKamar);
    const hargaPerBulan = selected?.harga ?? 0;
    const total = useMemo(() => hargaPerBulan * durasi, [hargaPerBulan, durasi]);

    if (!kos) {
        return (
            <div className="rounded-2xl bg-surface p-8 text-center">
                <p className="text-text-secondary">Kos tidak ditemukan.</p>
                <Link href="/cari-kos" className="mt-4 inline-block text-primary font-semibold">Kembali ke Cari Kos</Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-text-primary">Pilih Tipe Kamar</label>
                    <select value={selectedKamar} onChange={(e) => setSelectedKamar(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                        {kos.kamar.map((k) => (
                            <option key={k.nama} value={k.nama} disabled={k.ketersediaan !== "Tersedia"}>
                                {k.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold text-text-primary">Nama Penyewa</label>
                    <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Lengkap Anda" className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">Nomor WhatsApp (Aktif)</label>
                    <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="081234567890" className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-text-primary">Tanggal Mulai Sewa</label>
                        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-primary">Durasi Sewa</label>
                        <select value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                            <option value={1}>1 Bulan</option>
                            <option value={3}>3 Bulan</option>
                            <option value={6}>6 Bulan</option>
                            <option value={12}>12 Bulan</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">Catatan Tambahan (Opsional)</label>
                    <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Jam kedatangan perkiraan, membawa motor, dll." rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
            </div>

            <div className="self-start rounded-2xl bg-surface p-6 shadow-sm space-y-4">
                <h3 className="font-heading text-sm font-bold text-text-primary">Ringkasan Pemesanan</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">Kos</span><span className="font-semibold text-text-primary">{kos.nama}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Tipe Kamar</span><span className="font-semibold text-text-primary">{selected?.nama ?? "-"}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Harga / Bulan</span><span className="font-semibold text-text-primary">{formatHarga(hargaPerBulan)}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Sisa Kamar</span><span className="font-semibold text-text-primary">{selected?.stok ?? "-"} kamar</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Durasi</span><span className="font-semibold text-text-primary">{durasi} Bulan</span></div>
                    <div className="flex justify-between border-t border-border pt-2"><span className="font-bold text-text-primary">Total Estimasi</span><span className="font-bold text-accent">{formatHarga(total)}</span></div>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-3 text-xs leading-5 text-blue-700 border border-blue-200">
                    <p>ⓘ Pemesanan akan dikonfirmasi pemilik. Bayar langsung kepada pemilik.</p>
                </div>
                <button type="button" onClick={() => alert(`Ajukan Pemesanan: ${nama} | ${selected?.nama} | ${durasi} Bulan | Total ${formatHarga(total)}`)} className="mt-2 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">Ajukan Pemesanan</button>
                <Link href="/" className="mt-2 block w-full rounded-lg border border-border bg-surface py-3 text-center text-xs font-semibold text-text-secondary hover:bg-background">Kembali ke Beranda</Link>
            </div>
        </div>
    );
}
