import KosCard from "./KosCard";
import { getTayangKosCards } from "@/lib/db/queries";
import { getFallbackKosCards } from "@/lib/db/compat";
import Footer from "./Footer";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export default async function KosSection() {
    const dbCards = await getTayangKosCards();
    // Fallback ke data statis selama tabel Supabase masih kosong.
    const cards = dbCards.length > 0 ? dbCards : getFallbackKosCards();

    return (
        <><section className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-6 items-center justify-between">

                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="font-heading font-extrabold text-3xl text-text-primary">
                        Kos Rekomendasi
                    </h2>

                    <p className="mt-2 font-body text-text-secondary">
                        Jelajahi berbagai pilihan kos nyaman untuk tempat tinggalmu.
                    </p>
                </div>

                <Link
                    href="/cari-kos"
                    className="ml-auto flex w-fit items-center gap-2 pb-5 font-body font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                    Lihat Semua <IconArrowRight size={16} stroke={2} color="#0f9d91" />
                </Link>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map(({ kos, cover, kamarTersedia, kamarTotal, stokTersedia }) => (
                        <KosCard
                            key={kos.id_kos}
                            id={kos.id_kos}
                            nama={kos.nama}
                            lokasi={kos.lokasi}
                            harga={kos.harga}
                            gambar={cover ?? "/img/kos-placeholder.png"}
                            tipe={kos.tipe}
                            kamarTersedia={kamarTersedia}
                            kamarTotal={kamarTotal}
                            stokTersedia={stokTersedia} />
                    ))}
                </div>

            </div>
        </section>
            <Footer /></>
    );
}
