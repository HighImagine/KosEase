import { TipeKos, tipeStyles, formatHarga, getKetersediaanStatus, getStatusLabel, statusStyles, kosList } from "@/data/kos";
import Image from "next/image";
import Link from "next/link";

type KosCardProps = {
    id: number;
    nama: string;
    lokasi: string;
    harga: number;
    gambar: string;
    tipe: TipeKos;
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
    const totalKamar = kosList.find((k) => k.id === id)?.kamar ?? [];
    const availableKamar = totalKamar.filter((k) => k.ketersediaan === "Tersedia").length;
    const availStatus = getKetersediaanStatus(totalKamar.length, availableKamar);
    const availLabel = getStatusLabel(availStatus);

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

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[availStatus]}`}>
                        {availLabel}
                    </span>
                </div>

                <p className="mt-1 font-body text-xs text-text-secondary">
                    Tersisa {availableKamar} kamar
                </p>

                <h3 className="mt-3 font-heading text-xl font-bold text-text-primary">
                    {nama}
                </h3>

                <p className="mt-1 font-body text-sm text-text-secondary">
                    {lokasi}
                </p>

                <p className="mt-4 font-heading text-lg font-bold text-primary">
                    {formatHarga(harga)}
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