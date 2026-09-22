import Link from "next/link";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import CariKosClient from "./CariKosClient";
import { Suspense } from "react";
import { getTayangKosCards } from "@/lib/db/queries";
import { getFallbackKosCards } from "@/lib/db/compat";

export default async function CariKosPage() {
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
                        Cari Kos
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Temukan kos yang sesuai dengan kebutuhanmu.
                    </p>
                </div>

                <Suspense><CariKosClient initial={cards} /></Suspense>

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-center gap-3">
                    {/* Kembali */}
                    <Link
                        href="/cari-kos"
                        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                    >
                        <IconArrowLeft size={16} stroke={2} color="#0f9d91" />
                        Kembali
                    </Link>

                    {/* Halaman 1 */}
                    <Link
                        href="/cari-kos?page=1"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white"
                    >
                        1
                    </Link>

                    {/* Halaman 2 */}
                    <Link
                        href="/cari-kos?page=2"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        2
                    </Link>

                    {/* Halaman 3 */}
                    <Link
                        href="/cari-kos?page=3"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        3
                    </Link>

                    {/* Halaman 4 */}
                    <Link
                        href="/cari-kos?page=4"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        4
                    </Link>

                    {/* Ellipsis, kalau sudah jalan database bisa dibikin seperti ini jga*/}
                    <span className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-text-secondary">
                        ...
                    </span>

                    {/* Halaman 10 */}
                    <Link
                        href="/cari-kos?page=10"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        10
                    </Link>

                    <Link
                        href="/cari-kos?page=2"
                        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                    >
                        Lanjut
                        <IconArrowRight size={16} stroke={2} color="#0f9d91" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}