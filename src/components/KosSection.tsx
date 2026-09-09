import KosCard from "./KosCard";
import { kosList } from "@/data/kos";
import Footer from "./Footer";
import Link from "next/link";
import Image from "next/image";

export default function KosSection() {
    return (
        <><section className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-6">

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
                    className="flex items-right gap-2 pb-5 font-body font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                    Lihat Semua
                    <Image
                        src="/img/arrow-right-primary.svg"
                        alt="Lihat semua"
                        width={20}
                        height={20}
                    />
                </Link>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {kosList.map((kos) => (
                        <KosCard
                            key={kos.id}
                            id={kos.id} //dummy id, diganti kalau udah jalan database
                            nama={kos.nama}
                            lokasi={kos.lokasi}
                            harga={kos.harga}
                            gambar={kos.gambar}
                            tipe={kos.tipe}
                            status={kos.status} />
                    ))}
                </div>

            </div>
        </section>
            <Footer /></>
    );
}