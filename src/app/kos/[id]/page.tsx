import { kosList, TipeKos } from "@/data/kos";
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

    const tipeStyles: Record<TipeKos, string> = {
        "Campur": "bg-type-campur-bg text-type-campur-text",
        "Laki-laki": "bg-type-laki-bg text-type-laki-text",
        "Perempuan": "bg-type-perempuan-bg text-type-perempuan-text",
    };

    return (
        <main className="min-h-screen bg-background">
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
                            className="object-cover"
                        />
                    </div>

                    {/* Side Images */}
                    <div className="grid grid-rows-2 gap-2">

                        <div className="relative">
                            <Image
                                src={kos.gambar}
                                alt={kos.nama}
                                fill
                                sizes="(max-width: 1024px) 33vw, 33vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="relative">
                            <Image
                                src="/img/kos-placeholder.png"
                                alt="Kos Putri Sakinah - Foto 3"
                                fill
                                sizes="(max-width: 1024px) 33vw, 33vw"
                                className="object-cover"
                            />
                        </div>

                    </div>
                </div>
                {/* Info Kos & Harga */}
                <section className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">

                        <div className="rounded-2xl bg-surface p-4">

                            <div className="flex items-center justify-between">

                                <span className="rounded-md bg-type-perempuan-bg px-2 py-1 text-[10px] font-semibold text-type-perempuan-text">
                                    {kos.tipe}
                                </span>

                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="text-accent">★</span>

                                    <span className="font-semibold text-text-primary">
                                        4.8
                                    </span>

                                    <span className="text-text-secondary">
                                        (24 ulasan)
                                    </span>
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

                            <p className="mt-3 text-text-secondary">
                                Deskripsi kos akan ditampilkan di sini.
                            </p>
                        </div>


                        {/* Fasilitas Kos */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Fasilitas Kos
                            </h2>

                            <div className="mt-4 grid grid-cols-3 gap-4">

                                <div>
                                    <p className="text-sm text-text-primary">
                                        📶 Koneksi WiFi Cepat
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-text-primary">
                                        ❄️ Full AC
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-text-primary">
                                        🚿 Kamar Mandi Dalam
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-text-primary">
                                        🅿️ Parkir Motor Luas
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-text-primary">
                                        🍳 Dapur Bersama
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-text-primary">
                                        🧺 Mesin Cuci Bersama
                                    </p>
                                </div>

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
                                </div>

                                {/* Data Kamar */}
                                <div className="grid grid-cols-3 items-center border-t border-border px-4 py-4">

                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">
                                            Kamar Standard
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            3 × 4 m
                                        </p>
                                    </div>

                                    <p className="text-sm font-semibold text-text-primary">
                                        Rp1.200.000
                                        <span className="font-normal text-text-secondary">
                                            {" "}/ bulan
                                        </span>
                                    </p>

                                    <span className="w-fit rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                        Tersedia
                                    </span>

                                </div>

                                {/* Data Kamar 2 */}
                                <div className="grid grid-cols-3 items-center border-t border-border px-4 py-4">

                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">
                                            Kamar Deluxe
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            4 × 4 m
                                        </p>
                                    </div>

                                    <p className="text-sm font-semibold text-text-primary">
                                        Rp1.500.000
                                        <span className="font-normal text-text-secondary">
                                            {" "}/ bulan
                                        </span>
                                    </p>

                                    <span className="w-fit rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                                        Hampir Penuh
                                    </span>

                                </div>

                            </div>

                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="self-start rounded-2xl bg-surface p-6 mx">

                        <p className="text-sm text-text-secondary">
                            Mulai dari
                        </p>

                        <p className="mt-1 font-heading text-2xl font-bold text-primary">
                            {kos.harga}
                            <span className="font-body text-sm font-normal text-text-secondary">
                                {" "}/ bulan
                            </span>
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
                                    1 Kamar Kosong
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

                        {/* Tombol Pesan */}
                        <button
                            type="button"
                            className="mt-5 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                        >
                            Pesan Kamar Sekarang
                        </button>

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
    );
}