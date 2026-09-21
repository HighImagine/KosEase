import Link from "next/link";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { kosList } from "@/data/kos";
import PemesananForm from "./PemesananForm";

type PageProps = {
    searchParams: Promise<{ kosId?: string }>;
};

export default async function PemesananPage({ searchParams }: PageProps) {
    const { kosId } = await searchParams;
    const kos = kosId ? kosList.find((k) => k.id === Number(kosId)) ?? null : null;

    return (
        <main className="min-h-screen bg-background">
            <NavbarWrapper />
            <div className="mx-auto max-w-7xl px-6 py-6">
                <Link href={kos ? `/kos/${kos.id}` : "/cari-kos"} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">← Kembali</Link>
                <div className="mt-6">
                    <PemesananForm kos={kos} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
