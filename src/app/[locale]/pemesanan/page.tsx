import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { getMyWaitlist, getPublicKosDetail } from "@/lib/db/queries";
import { getFallbackKosDetail } from "@/lib/db/compat";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PemesananForm from "./PemesananForm";

type PageProps = {
    searchParams: Promise<{ kosId?: string; waitlistId?: string }>;
};

export default async function PemesananPage({ searchParams }: PageProps) {
    const t = await getTranslations("Booking");
    const { kosId, waitlistId } = await searchParams;
    // kosId uuid dari DB; fallback ke id numerik lama selama migrasi.
    const detail = kosId ? ((await getPublicKosDetail(kosId)) ?? getFallbackKosDetail(kosId)) : null;
    const kos = detail
        ? { id: detail.kos.id_kos, nama: detail.kos.nama, kamar: detail.kamar }
        : null;

    const offers = waitlistId ? await getMyWaitlist() : [];
    const offer = offers.find((item) => item.id === waitlistId && item.status === "ditawarkan" && item.slot_mulai);

    return (
        <main className="min-h-screen bg-background">
            <NavbarWrapper />
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link href={kos ? `/kos/${kos.id}` : "/cari-kos"} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">{t("back")}</Link>
                <div className="mt-6">
                    {!kos ? (
                        <div className="rounded-2xl bg-surface p-8 text-center">
                            <p className="text-text-secondary">{t("notFound")}</p>
                            <Link href="/cari-kos" className="mt-4 inline-block text-primary font-semibold">{t("backToSearch")}</Link>
                        </div>
                    ) : kos.kamar.length > 0 ? (
                        <PemesananForm kos={kos} claim={offer ? { id: offer.id, kamarId: offer.kamar_id, slotMulai: offer.slot_mulai! } : null} />
                    ) : (
                        <div className="mx-auto max-w-xl rounded-2xl bg-surface p-8 text-center shadow-sm">
                            <h2 className="font-heading text-base font-bold text-text-primary">{t("noRooms")}</h2>
                            <p className="mt-2 text-sm text-text-secondary">{t("noRoomsMsg")}</p>
                            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                                <Link href="/cari-kos" className="inline-block rounded-lg bg-primary px-5 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-primary-dark">{t("fullCta")}</Link>
                                <Link href={`/kos/${kos.id}`} className="inline-block rounded-lg border border-border bg-surface px-5 py-2.5 text-center text-xs font-semibold text-text-secondary hover:bg-background">{t("back")}</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
