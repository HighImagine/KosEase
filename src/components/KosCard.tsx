import { TipeKos, tipeStyles, getKetersediaanStatus, getStatusLabel, statusStyles } from "@/data/kos";
import { formatHarga } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

type KosCardProps = {
    id: string;
    nama: string;
    lokasi: string;
    harga: number;
    gambar: string;
    tipe: string;
    kamarTersedia: number; // jumlah tipe kamar berstatus Tersedia
    kamarTotal: number;
    stokTersedia: number; // total sisa unit kamar Tersedia
};

export default function KosCard({
    id,
    nama,
    lokasi,
    harga,
    gambar,
    tipe,
    kamarTersedia,
    kamarTotal,
    stokTersedia,
}: KosCardProps) {
    const availStatus = getKetersediaanStatus(kamarTotal, kamarTersedia);
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
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${tipeStyles[tipe as TipeKos] ?? ""
                            }`}
                    >
                        {tipe}
                    </span>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[availStatus]}`}>
                        {availLabel}
                    </span>
                </div>

                <p className="mt-1 font-body text-xs text-text-secondary">
                    Tersisa {stokTersedia} kamar
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
