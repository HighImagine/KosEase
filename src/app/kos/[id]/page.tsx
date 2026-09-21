import Footer from "@/components/Footer";
import { kosList, tipeStyles, formatHarga } from "@/data/kos";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function KosDetailPage({ params }: PageProps) {
    const { id } = await params;
    const kos = kosList.find((item) => item.id === Number(id));

    if (!kos) {
        return <div>Kos tidak ditemukan.</div>;
    }

    return (
        <><main className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-6 py-6">

                <Link
                    href="/"
                    className="mb-4 inline-flex items-center text-sm text-primary font-semibold transition-colors hover:text-primary-dark"
                >
                    ← Kembali
                </Link>

                <div className="grid h-105 grid-cols-3 gap-2 overflow-hidden rounded-2xl">

                    <div className="relative col-span-2">
                        <Image
                            src="/img/kos-placeholder.png"
                            alt="Kos Putri Sakinah"
                            fill
                            sizes="(max-width: 1024px) 66vw, 66vw"
                            className="object-cover" />
                    </div>

                    {/* Side Images */}
                    <div className="grid grid-rows-2 gap-2">
                        <div className="relative">
                            <Image src={kos.images[1] ?? kos.gambar} alt={kos.nama} fill sizes="(max-width: 1024px) 33vw, 33vw" className="object-cover" />
                        </div>
                        <div className="relative">
                            <Image src={kos.images[2] ?? kos.gambar} alt={`${kos.nama} - Foto 3`} fill sizes="(max-width: 1024px) 33vw, 33vw" className="object-cover" />
                        </div>
                    </div>
                </div>
                {/* Info Kos & Harga */}
                <section className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">

                        <div className="rounded-2xl bg-surface p-4">

                            <div className="flex items-center justify-between">

                                <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${tipeStyles[kos.tipe]}`}>
                                    {kos.tipe}
                                </span>

                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="text-accent">★</span>
                                    <span className="font-semibold text-text-primary">{kos.rating.toFixed(1)}</span>
                                    <span className="text-text-secondary">({kos.ulasanCount} ulasan)</span>
                                </div>

                            </div>


                            <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                                {kos.nama}
                            </h1>

                            {/* Lokasi */}
                            <p className="mt-2 text-[10px] text-text-secondary">
                                {kos.lokasi}
                            </p>

                        </div>



                        {/* Kotak kiri 2 */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Deskripsi
                            </h2>

                            <p className="mt-3 text-text-secondary">{kos.deskripsi}</p>
                        </div>


                        {/* Fasilitas Kos */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Fasilitas Kos
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {kos.fasilitas.map((f) => (
                                    <span key={f} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-text-primary">{f}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tipe Kamar & Ketersediaan */}
                        <div className="rounded-2xl bg-surface p-6">

                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Tipe Kamar & Ketersediaan
                            </h2>

                            <div className="mt-4 overflow-hidden rounded-xl border border-border">

                                {/* Header */}
                                <div className="grid grid-cols-3 bg-background px-4 py-3">
                                    <p className="text-xs font-semibold text-text-secondary">
                                        Tipe Kamar
                                    </p>

                                    <p className="text-xs font-semibold text-text-secondary">
                                        Harga
                                    </p>

                                    <p className="text-xs font-semibold text-text-secondary">
                                        Ketersediaan
                                    </p>
                                    <p className="text-xs font-semibold text-text-secondary">
                                        Sisa
                                    </p>
                                </div>

{kos.kamar.map((k) => {
    const isTersedia = k.ketersediaan === "Tersedia";
    const badgeStyle = isTersedia ? "bg-success/10 text-success" : "bg-error/10 text-error";
    return (
    <div key={k.nama} className="grid grid-cols-[1fr_auto_auto] items-center border-t border-border px-4 py-4 gap-4">
        <div>
            <p className="text-sm font-semibold text-text-primary">Kamar {k.nama}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{k.ukuran} · {k.stok} kamar</p>
        </div>
        <p className="text-sm font-semibold text-text-primary">{formatHarga(k.harga)}<span className="font-normal text-text-secondary"> / bulan</span></p>
        <div className="flex items-center gap-2">
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>{isTersedia ? "Tersedia" : "Penuh"}</span>
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary border border-border">{k.stok}</span>
        </div>
    </div>
    );
})}

                                 {/* Ringkasan */}
                                 <div className="grid grid-cols-3 bg-background px-4 py-3 border-t border-border">
                                     <p className="text-xs font-semibold text-text-secondary">Total</p>
                                     <p className="text-xs font-semibold text-text-secondary"></p>
                                     <p className="text-xs font-semibold text-text-secondary">{kos.kamar.reduce((a,c)=>a+c.stok,0)} kamar</p>
                                 </div>

                            </div>

                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="self-start rounded-2xl bg-surface p-6">

                        <p className="text-sm text-text-secondary">
                            Mulai dari
                        </p>

                        <p className="mt-1 font-heading text-2xl font-bold text-primary">
                            {formatHarga(kos.harga)}
                            <span className="font-body text-sm font-normal text-text-secondary"> / bulan</span>
                        </p>

                        <div className="mt-6 space-y-3 text-xs">

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">
                                    Tipe Kos
                                </span>

                                <span
                                    className={`rounded-md px-2 py-1 text-[10px] font-semibold ${tipeStyles[kos.tipe]}`}
                                >
                                    {kos.tipe}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">
                                    Kamar Tersedia
                                </span>

                                <span className="font-semibold text-primary">
                                    {kos.kamar.filter((k)=>k.ketersediaan==="Tersedia").length} Kamar Kosong
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">
                                    Biaya Tambahan
                                </span>

                                <span className="text-text-primary">
                                    Sudah Termasuk Listrik
                                </span>
                            </div>

                        </div>

{kos.kamar.every((k) => k.ketersediaan === "Penuh") && <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">Kos ini sedang penuh — cek kembali nanti atau hubungi pemilik.</p>}
                        {kos.kamar.every((k) => k.ketersediaan === "Penuh") ? (
                            <button disabled className="mt-5 w-full rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-500">Penuh</button>
                        ) : (
                            <Link href={`/pemesanan?kosId=${kos.id}`} className="mt-5 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-600">Ajukan Pemesanan</Link>
                        )}

                        {/* Simpan & Bagikan */}
                        <div className="mt-3 grid grid-cols-2 gap-2">

                            <button
                                type="button"
                                className="rounded-lg bg-background px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-border"
                            >
                                ♡ Simpan
                            </button>

                            <button
                                type="button"
                                className="rounded-lg bg-background px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-border"
                            >
                                ↗ Bagikan
                            </button>

                        </div>

                    </div>

                </section>
            </div>
        </main>
            <Footer /></>
    );
}