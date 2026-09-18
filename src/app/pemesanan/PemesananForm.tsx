"use client";
import { useState, useMemo } from "react";
import { formatHarga } from "@/data/kos";
import Link from "next/link";

type Props = {
    hargaPerBulan: number;
};

const durasiOptions = [
    { label: "1 Bulan", value: 1 },
    { label: "3 Bulan", value: 3 },
    { label: "6 Bulan", value: 6 },
    { label: "12 Bulan", value: 12 },
];

export default function PemesananForm({ hargaPerBulan }: Props) {
    const [nama, setNama] = useState("");
    const [wa, setWa] = useState("");
    const [tanggal, setTanggal] = useState("2026-03-10");
    const [durasi, setDurasi] = useState(3);
    const [catatan, setCatatan] = useState("");

    const total = useMemo(() => hargaPerBulan * durasi, [hargaPerBulan, durasi]);
    const durasiLabel = durasiOptions.find((d) => d.value === durasi)?.label ?? `${durasi} Bulan`;

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left form */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-text-primary">Nama Penyewa</label>
                    <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Andi Pratama" className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">Nomor WhatsApp (Aktif)</label>
                    <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="081234567890" className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-text-primary">Tanggal Mulai Sewa</label>
                        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-primary">Durasi Sewa</label>
                        <select value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary">
                            {durasiOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">Catatan Tambahan untuk Pemilik (Opsional)</label>
                    <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tulis catatan di sini... (misal: jam kedatangan perkiraan, membawa kendaraan motor, dll.)" rows={4} className="mt-1.5 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
            </div>

            {/* Right summary */}
            <div className="self-start rounded-2xl bg-surface p-6 shadow-sm">
                <h3 className="font-heading text-base font-bold text-text-primary">Ringkasan Pemesanan</h3>
                <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">Durasi Sewa</span><span className="font-semibold text-text-primary">{durasiLabel}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Harga Kamar / Bulan</span><span className="font-semibold text-text-primary">{formatHarga(hargaPerBulan)}</span></div>
                    <div className="flex justify-between border-t border-border pt-3"><span className="font-bold text-text-primary">Total Estimasi Pembayaran</span><span className="font-bold text-accent">{formatHarga(total)}</span></div>
                </div>
                <div className="mt-4 flex gap-3 rounded-lg bg-blue-50 px-3 py-3 text-xs leading-5 text-blue-700 border border-blue-200">
                    <span className="shrink-0">ⓘ</span>
                    <p>Pemesanan Anda akan dikonfirmasi oleh pemilik kos. Pembayaran dilakukan langsung kepada pemilik.</p>
                </div>
                <button type="button" onClick={() => alert(`Ajukan Pemesanan: ${nama || "(nama kosong)"} | ${wa || "-"} | ${tanggal} | ${durasiLabel} | Total ${formatHarga(total)}`)} className="mt-4 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">Ajukan Pemesanan</button>
                <Link href="/dashboard" className="mt-3 block w-full rounded-lg border border-border bg-surface py-3 text-center text-sm font-semibold text-text-secondary hover:bg-background">Kembali</Link>
            </div>
        </div>
    );
}
