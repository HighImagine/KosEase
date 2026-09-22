import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { getPublicKosDetail } from "@/lib/db/queries";
import { getFallbackKosDetail } from "@/lib/db/compat";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PemesananForm from "./PemesananForm";

type PageProps = {
    searchParams: Promise<{ kosId?: string }>;
};

export default async function PemesananPage({ searchParams }: PageProps) {
    const t = await getTranslations("Booking");
    const { kosId } = await searchParams;
    // kosId uuid dari DB; fallback ke id numerik lama selama migrasi.
    const detail = kosId ? ((await getPublicKosDetail(kosId)) ?? getFallbackKosDetail(kosId)) : null;
    const kos = detail
        ? { id: detail.kos.id_kos, nama: detail.kos.nama, kamar: detail.kamar }
        : null;

    return (
        <main className="min-h-screen bg-background">
            <NavbarWrapper />
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link href={kos ? `/kos/${kos.id}` : "/cari-kos"} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">{t("back")}</Link>
                <div className="mt-6">
                    <PemesananForm kos={kos} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
