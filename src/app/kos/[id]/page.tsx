import Footer from "@/components/Footer";
import { tipeStyles, type TipeKos } from "@/data/kos";
import { formatHarga } from "@/lib/format";
import { getKosOwner, getPublicKosDetail } from "@/lib/db/queries";
import { getFallbackKosDetail } from "@/lib/db/compat";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER = "/img/kos-placeholder.png";
const PLACEHOLDER_AVATAR = "/img/avatar-default.png";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function KosDetailPage({ params }: PageProps) {
    const { id } = await params;
    // id uuid dari DB; fallback ke data statis (id numerik lama) selama migrasi.
    const detail = (await getPublicKosDetail(id)) ?? getFallbackKosDetail(id);

    if (!detail) {
        return <div>Kos tidak ditemukan.</div>;
    }
    const { kos, kamar, galeri, fasilitas } = detail;
    const cover = galeri[0]?.image_url ?? PLACEHOLDER;
    const owner = await getKosOwner(kos.id_pemilik);

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
                            src={cover}
                            alt={kos.nama}
                            fill
                            sizes="(max-width: 1024px) 66vw, 66vw"
                            className="object-cover" />
                    </div>

                    {/* Side Images */}
                    <div className="grid grid-rows-2 gap-2">
                        <div className="relative">
                            <Image src={galeri[1]?.image_url ?? PLACEHOLDER} alt={kos.nama} fill sizes="(max-width: 1024px) 33vw, 33vw" className="object-cover" />
                        </div>
                        <div className="relative">
                            <Image src={galeri[2]?.image_url ?? PLACEHOLDER} alt={`${kos.nama} - Foto 3`} fill sizes="(max-width: 1024px) 33vw, 33vw" className="object-cover" />
                        </div>
                    </div>
                </div>
                {/* Info Kos & Harga */}
                <section className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">

                        <div className="rounded-2xl bg-surface p-4">

                            <div className="flex items-center justify-between">

                                <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${tipeStyles[kos.tipe as TipeKos] ?? ""}`}>
                                    {kos.tipe}
                                </span>

                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="text-accent">★</span>
                                    <span className="font-semibold text-text-primary">{kos.rating.toFixed(1)}</span>
                                    <span className="text-text-secondary">({kos.ulasan} ulasan)</span>
                                </div>

                            </div>


                            <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                                {kos.nama}
                            </h1>

                            {/* Lokasi */}
                            <p className="mt-2 text-[10px] text-text-secondary">
                                {kos.lokasi} · {kos.alamat}
                            </p>

                        </div>



                        {/* Kotak kiri 2 */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Deskripsi
                            </h2>

                            <p className="mt-3 text-text-secondary">{kos.deskripsi ?? "-"}</p>
                        </div>


                        {/* Fasilitas Kos */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Fasilitas Kos
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {fasilitas.length === 0 ? (
                                    <p className="text-sm text-text-secondary">Belum ada data fasilitas.</p>
                                ) : (
                                    fasilitas.map((f) => (
                                        <span key={f} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-text-primary">{f}</span>
                                    ))
                                )}
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

                                {kamar.map((k) => {
                                    const isTersedia = k.ketersediaan === "Tersedia";
                                    const badgeStyle = isTersedia ? "bg-success/10 text-success" : "bg-error/10 text-error";
                                    return (
                                        <div key={k.id} className="grid grid-cols-[1fr_auto_auto] items-center border-t border-border px-4 py-4 gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-text-primary">Kamar {k.nama}</p>
                                                <p className="mt-0.5 text-xs text-text-secondary">{k.ukuran ?? "-"} · {k.stok} kamar</p>
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
                                    <p className="text-xs font-semibold text-text-secondary">{kamar.reduce((a, c) => a + c.stok, 0)} kamar</p>
                                </div>

                            </div>

                        </div>

                        {/* Dikelola oleh */}
                        <div className="rounded-2xl p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Dikelola oleh
                            </h2>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                                    <Image src={owner?.avatar_url ?? PLACEHOLDER_AVATAR} alt={owner?.nama ?? "Pemilik Kos"} fill sizes="56px" className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-text-primary">{owner?.nama ?? "Pemilik Kos"}</p>
                                    </div>
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
                                    className={`rounded-md px-2 py-1 text-[10px] font-semibold ${tipeStyles[kos.tipe as TipeKos] ?? ""}`}
                                >
                                    {kos.tipe}
                                </span>
                            </div>

                        </div>

                        {kamar.every((k) => k.ketersediaan === "Penuh") && <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">Kos ini sedang penuh — cek kembali nanti atau hubungi pemilik.</p>}
                        {kamar.length > 0 && kamar.every((k) => k.ketersediaan === "Penuh") ? (
                            <button disabled className="mt-5 w-full rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-500">Penuh</button>
                        ) : (
                            <Link href={`/pemesanan?kosId=${kos.id_kos}`} className="mt-5 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-600">Ajukan Pemesanan</Link>
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
