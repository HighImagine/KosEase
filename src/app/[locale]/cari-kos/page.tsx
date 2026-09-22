import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import CariKosClient from "./CariKosClient";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getTayangKosCards } from "@/lib/db/queries";
import { getFallbackKosCards } from "@/lib/db/compat";

export default async function CariKosPage() {
    const t = await getTranslations("Search");
    const dbCards = await getTayangKosCards();
    // Fallback ke data statis selama tabel Supabase masih kosong.
    const cards = dbCards.length > 0 ? dbCards : getFallbackKosCards();
    return (
        <main className="min-h-screen bg-background">
            <NavbarWrapper />

            <section className="mx-auto max-w-7xl px-10 py-10">
                {/* Header */}
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">
                        {t("title")}
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        {t("desc")}
                    </p>
                </div>

                <Suspense><CariKosClient initial={cards} /></Suspense>
            </section>

            <Footer />
        </main>
    );
}