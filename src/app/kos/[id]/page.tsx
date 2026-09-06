import Image from "next/image";
import Link from "next/link";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function KosDetailPage({ params }: PageProps) {
    const { id } = await params;

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
                                src="/img/kos-placeholder.png"
                                alt="Kos Putri Sakinah - Foto 2"
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

                    {/* KOLOM KIRI */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Kotak kiri 1 */}
                        <div className="rounded-2xl bg-surface p-4">

                            {/* Badge + Rating */}
                            <div className="flex items-center justify-between">

                                {/* Badge tipe kos */}
                                <span className="rounded-md bg-pink-100 px-2 py-1 text-[10px] font-semibold text-pink-800">
                                    Putri
                                </span>

                                {/* Rating */}
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

                            {/* Nama Kos */}
                            <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                                Kos Putri Sakinah Depok Sleman
                            </h1>

                            {/* Lokasi */}
                            <p className="mt-2 text-[10px] text-text-secondary">
                                📍 Jl. Bougenville No. 12, Karang Gayam, Caturtunggal, Kec. Depok, Sleman, Yogyakarta
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
                    <div className="rounded-2xl bg-surface p-6">
                        <p className="text-sm text-text-secondary">
                            Mulai dari
                        </p>

                        <p className="mt-1 font-heading text-2xl font-bold text-primary">
                            Rp1.200.000
                            <span className="font-body text-sm font-normal text-text-secondary">
                                {" "}/ bulan
                            </span>
                        </p>
                    </div>

                </section>
            </div>
        </main>
    );
}