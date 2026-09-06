import KosCard from "./KosCard";

export default function KosSection() {
    const kosList = [
        {
            id: 1, //DUMMY
            nama: "Kos Melati",
            lokasi: "Yogyakarta",
            harga: "Rp800.000",
            gambar: "/img/kos-placeholder.png",
            tipe: "Perempuan",
            status: "Tersedia",
        },
        {
            id: 2, // DUMMY
            nama: "Kos Mawar",
            lokasi: "Bandung",
            harga: "Rp1.000.000",
            gambar: "/img/kos-placeholder.png",
            tipe: "Campur",
            status: "Tersedia",
        },
        {   id: 3, //DUMMY
            nama: "Kos Dahlia",
            lokasi: "Malang",
            harga: "Rp750.000",
            gambar: "/img/kos-placeholder.png",
            tipe: "Laki-laki",
            status: "Tersedia 2 Kamar",
        },
    ];
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
                            status={kos.status}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}