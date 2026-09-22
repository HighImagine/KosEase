import Footer from "@/components/Footer";
import { tipeStyles, type TipeKos } from "@/data/kos";
import { formatHarga } from "@/lib/format";
import { getKosOwner, getPublicKosDetail } from "@/lib/db/queries";
import { getFallbackKosDetail } from "@/lib/db/compat";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const PLACEHOLDER = "/img/kos-placeholder.png";
const PLACEHOLDER_AVATAR = "/img/avatar-default.png";

const tipeLabelKey: Record<string, string> = {
    "Campur": "tipeCampur",
    "Laki-laki": "tipeLaki",
    "Perempuan": "tipePerempuan",
};

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function KosDetailPage({ params }: PageProps) {
    const { id } = await params;
    const t = await getTranslations("Detail");
    const tc = await getTranslations("Common");
    const tk = await getTranslations("KosCard");
    // id uuid dari DB; fallback ke data statis (id numerik lama) selama migrasi.
    const detail = (await getPublicKosDetail(id)) ?? getFallbackKosDetail(id);

    if (!detail) {
        return <div>{tc("kosNotFound")}</div>;
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
                    {t("back")}
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
                                    {tk(tipeLabelKey[kos.tipe] ?? "tipeCampur")}
                                </span>

                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="text-accent">★</span>
                                    <span className="font-semibold text-text-primary">{kos.rating.toFixed(1)}</span>
                                    <span className="text-text-secondary">({kos.ulasan} {t("reviews")})</span>
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
                                {t("descTitle")}
                            </h2>

                            <p className="mt-3 text-text-secondary">{kos.deskripsi ?? t("descEmpty")}</p>
                        </div>


                        {/* Fasilitas Kos */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                {t("facilities")}
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {fasilitas.length === 0 ? (
                                    <p className="text-sm text-text-secondary">{t("facilitiesEmpty")}</p>
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
                                {t("rooms")}
                            </h2>

                            <div className="mt-4 overflow-hidden rounded-xl border border-border">

                                {/* Header */}
                                <div className="grid grid-cols-3 bg-background px-4 py-3">
                                    <p className="text-xs font-semibold text-text-secondary">
                                        {t("colType")}
                                    </p>

                                    <p className="text-xs font-semibold text-text-secondary">
                                        {t("colPrice")}
                                    </p>

                                    <p className="text-xs font-semibold text-text-secondary">
                                        {t("colAvail")}
                                    </p>
                                    <p className="text-xs font-semibold text-text-secondary">
                                        {t("colLeft")}
                                    </p>
                                </div>

{kamar.map((k) => {
    const isTersedia = k.ketersediaan === "Tersedia";
    const badgeStyle = isTersedia ? "bg-success/10 text-success" : "bg-error/10 text-error";
    return (
    <div key={k.id} className="grid grid-cols-[1fr_auto_auto] items-center border-t border-border px-4 py-4 gap-4">
        <div>
            <p className="text-sm font-semibold text-text-primary">{t("roomPrefix")}{k.nama}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{k.ukuran ?? "-"} · {k.stok} {t("roomsUnit")}</p>
        </div>
        <p className="text-sm font-semibold text-text-primary">{formatHarga(k.harga)}<span className="font-normal text-text-secondary"> {tc("perMonth")}</span></p>
        <div className="flex items-center gap-2">
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}>{isTersedia ? t("available") : t("unavailable")}</span>
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary border border-border">{k.stok}</span>
        </div>
    </div>
    );
})}

                                 {/* Ringkasan */}
                                 <div className="grid grid-cols-3 bg-background px-4 py-3 border-t border-border">
                                     <p className="text-xs font-semibold text-text-secondary">{t("total")}</p>
                                     <p className="text-xs font-semibold text-text-secondary"></p>
                                     <p className="text-xs font-semibold text-text-secondary">{kamar.reduce((a,c)=>a+c.stok,0)} {t("roomsUnit")}</p>
                                 </div>

                            </div>

                        </div>

                        {/* Dikelola oleh */}
                        <div className="rounded-2xl bg-surface p-6">
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                {t("ownerTitle")}
                            </h2>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                                    <Image src={owner?.avatar_url ?? PLACEHOLDER_AVATAR} alt={owner?.nama ?? t("genericOwner")} fill sizes="56px" className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-text-primary">{owner?.nama ?? t("genericOwner")}</p>
                                        {owner?.nama && (
                                            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success">{t("verifiedOwner")}</span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-text-secondary">{t("viaPlatform")}</p>
                                </div>
                            </div>

                            <Link href={`/pemesanan?kosId=${kos.id_kos}`} className="mt-4 block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-dark">
                                {t("order")}
                            </Link>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="self-start rounded-2xl bg-surface p-6">

                        <p className="text-sm text-text-secondary">
                            {t("from")}
                        </p>

                        <p className="mt-1 font-heading text-2xl font-bold text-primary">
                            {formatHarga(kos.harga)}
                            <span className="font-body text-sm font-normal text-text-secondary"> {tc("perMonth")}</span>
                        </p>

                        <div className="mt-6 space-y-3 text-xs">

                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">
                                    {t("type")}
                                </span>

                                <span
                                    className={`rounded-md px-2 py-1 text-[10px] font-semibold ${tipeStyles[kos.tipe as TipeKos] ?? ""}`}
                                >
                                    {tk(tipeLabelKey[kos.tipe] ?? "tipeCampur")}
                                </span>
                            </div>

                        </div>

{kamar.length > 0 && kamar.every((k) => k.ketersediaan === "Penuh") && <p className="mt-4 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">{t("fullMsg")}</p>}
                        {kamar.length > 0 && kamar.every((k) => k.ketersediaan === "Penuh") ? (
                            <button disabled className="mt-5 w-full rounded-lg bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-500">{t("full")}</button>
                        ) : (
                            <Link href={`/pemesanan?kosId=${kos.id_kos}`} className="mt-5 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-600">{t("order")}</Link>
                        )}

                        {/* Simpan & Bagikan */}
                        <div className="mt-3 grid grid-cols-2 gap-2">

                            <button
                                type="button"
                                className="rounded-lg bg-background px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-border"
                            >
                                {t("save")}
                            </button>

                            <button
                                type="button"
                                className="rounded-lg bg-background px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-border"
                            >
                                {t("share")}
                            </button>

                        </div>

                    </div>

                </section>
            </div>
        </main>
            <Footer /></>
    );
}
