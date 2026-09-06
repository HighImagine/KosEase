type KosCardProps = {
    nama: string;
    lokasi: string;
    harga: string;
};

export default function KosCard({
    nama,
    lokasi,
    harga,
}: KosCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm transition-shadow hover:shadow-md">

            {/* Image */}
            <div className="h-52 bg-primary-light">
                {/* Nanti gambar kos */}
            </div>

            {/* Content */}
            <div className="p-5">

                <h3 className="font-heading text-xl font-bold text-text-primary">
                    {nama}
                </h3>

                <p className="mt-1 font-body text-sm text-text-secondary">
                    {lokasi}
                </p>

                <p className="mt-4 font-heading text-lg font-bold text-primary">
                    {harga}
                    <span className="font-body text-sm font-normal text-text-secondary">
                        {" "}/ bulan
                    </span>
                </p>

                <button className="mt-4 w-full rounded-lg bg-primary py-2.5 font-body font-semibold text-white transition-colors hover:bg-primary-dark">
                    Lihat Detail
                </button>

            </div>
        </div>
    );
}