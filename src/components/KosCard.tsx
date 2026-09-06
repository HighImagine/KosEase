import Image from "next/image";
import Link from "next/link";

type KosCardProps = {
    id: number;
    nama: string;
    lokasi: string;
    harga: string;
    gambar: string;
    tipe: string;
    status: string;
};

export default function KosCard({
    id,
    nama,
    lokasi,
    harga,
    gambar,
    tipe,
    status,
}: KosCardProps) {
    const tipeStyles: Record<string, string> = {
        "Campur": "bg-type-campur-bg text-type-campur-text",
        "Laki-laki": "bg-type-laki-bg text-type-laki-text",
        "Perempuan": "bg-type-perempuan-bg text-type-perempuan-text",
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-52">
                <Image
                    src={gambar}
                    alt={nama}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                />
            </div>

            <div className="p-5">

                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${tipeStyles[tipe]
                            }`}
                    >
                        {tipe}
                    </span>

                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                        {status}
                    </span>
                </div>

                <h3 className="mt-3 font-heading text-xl font-bold text-text-primary">
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

                <Link
                    href={`/kos/${id}`}
                    className="mt-4 block w-full rounded-lg bg-primary py-2.5 text-center font-body font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                    Lihat Detail
                </Link>

            </div>
        </div>
    );
}