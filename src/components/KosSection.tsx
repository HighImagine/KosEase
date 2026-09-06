import KosCard from "./KosCard";

export default function KosSection() {
    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="font-heading font-extrabold text-3xl text-text-primary">
                        Kos Pilihan Untukmu
                    </h2>

                    <p className="mt-2 font-body text-text-secondary">
                        Temukan tempat tinggal yang sesuai dengan kebutuhanmu.
                    </p>
                </div>

                {/* Kos Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <KosCard
                        nama="Kos Melati"
                        lokasi="Malang"
                        harga="Rp500.000"
                    />
                    <KosCard
                        nama="Kos Melati"
                        lokasi="Malang"
                        harga="Rp500.000"
                    />
                    <KosCard
                        nama="Kos Melati"
                        lokasi="Malang"
                        harga="Rp500.000"
                    />
                </div>

            </div>
        </section>
    );
}