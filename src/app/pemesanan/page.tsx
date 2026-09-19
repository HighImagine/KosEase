import Link from "next/link";
import Image from "next/image";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { kosList, formatHarga, getKetersediaanStatus, getStatusLabel, statusStyles } from "@/data/kos";
import PemesananForm from "./PemesananForm";

type PageProps = {
    searchParams: Promise<{ kosId?: string; kamar?: string }>;
};

export default async function PemesananPage({ searchParams }: PageProps) {
    const { kosId, kamar } = await searchParams;
    // standalone: jika kosId ada pakai data kos, fallback ke mock sesuai image
    const kos = kosId ? kosList.find((k) => k.id === Number(kosId)) : undefined;
    const display = kos
        ? { nama: kos.nama, harga: kos.kamar.find((x) => x.nama === kamar)?.harga ?? kos.harga, tipe: kos.tipe, gambar: kos.gambar, kamarLabel: kamar ? `Kamar ${kamar}` : `Kamar ${kos.kamar[0].nama}`, fasilitas: kos.kamar.find((x) => x.nama === kamar)?.nama ? `${kos.kamar.find((x) => x.nama === kamar)?.nama} • ${kos.fasilitas.slice(0, 3).join(", ")}` : kos.fasilitas.slice(0, 3).join(", "), sisa: `${kos.kamar.reduce((a, c) => a + c.stok, 0)} Kamar` }
        : { nama: "Kos Podomoro Exclusive", harga: 1500000, tipe: "Campur", gambar: "/img/kos-placeholder.png", kamarLabel: "Kamar Deluxe B", fasilitas: "Wifi, AC, Kamar Mandi Dalam", sisa: "Tersisa 2 Kamar" };

    return (
        <main className="min-h-screen bg-background">
            <NavbarWrapper />
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link href={kos ? `/kos/${kos.id}` : "/cari-kos"} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">← Kembali</Link>

                {/* Kos header card sesuai pemesanan.png */}
                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-surface p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                            <Image src={display.gambar} alt={display.nama} fill sizes="80px" className="object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">{display.tipe}</span>
                                {kos && (() => {
                                    const totalStok = kos.kamar.reduce((a,c) => a+c.stok, 0);
                                    const availStok = kos.kamar.filter((k) => k.ketersediaan === "Tersedia").length;
                                    const s = getKetersediaanStatus(totalStok, availStok);
                                    return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[s]}`}>{getStatusLabel(s)}</span>;
                                })()}
                            </div>
                            <h1 className="mt-1 font-heading text-lg font-bold text-text-primary">{display.nama}</h1>
                            <p className="text-xs text-text-secondary">{display.kamarLabel} • {display.fasilitas}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-text-secondary">Harga Per Bulan</p>
                        <p className="font-heading text-lg font-bold text-primary">{formatHarga(display.harga)}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <PemesananForm hargaPerBulan={display.harga} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
