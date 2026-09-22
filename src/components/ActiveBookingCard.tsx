"use client";
import Image from "next/image";
import { formatHarga } from "@/lib/format";
import { useTranslations } from "next-intl";

type StatusLabel = "Menunggu" | "Disetujui" | "Ditolak" | "Selesai";

const statusStyle: Record<StatusLabel, string> = {
    Menunggu: "bg-orange-100 text-orange-600",
    Disetujui: "bg-green-100 text-green-700",
    Selesai: "bg-green-100 text-green-700",
    Ditolak: "bg-red-100 text-red-700",
};

const statusKey: Record<StatusLabel, string> = {
    Menunggu: "statusMenunggu",
    Disetujui: "statusDisetujui",
    Ditolak: "statusDitolak",
    Selesai: "statusSelesai",
};

export type ActiveBookingCardProps = {
    gambar: string;
    namaKos: string;
    kamarNama: string; // e.g. "Kamar A3"
    kamarDetail: string; // e.g. "3x4m • Kamar Mandi Dalam"
    tanggalMasuk: string; // e.g. "1 Februari 2026" sudah format id-ID
    harga: number;
    status: StatusLabel;
};

export default function ActiveBookingCard({
    gambar,
    namaKos,
    kamarNama,
    kamarDetail,
    tanggalMasuk,
    harga,
    status,
}: ActiveBookingCardProps) {
    const t = useTranslations("ActiveBooking");
    return (
        <div className="overflow-hidden rounded-xl bg-surface">
            <div className="flex items-center justify-between px-4 py-3 bg-background">
                <p className="text-xs font-semibold text-text-secondary">{t("active")}</p>
            </div>
            {/* header */}
            <div className="grid grid-cols-[1fr_140px_120px_130px] gap-4 bg-slate-50 px-4 py-2 text-xs font-semibold text-text-secondary max-md:hidden">
                <span>{t("colKos")}</span>
                <span className="text-center">{t("colDate")}</span>
                <span className="text-center">{t("colStatus")}</span>
                <span className="text-right">{t("colPrice")}</span>
            </div>
            {/* row */}
            <div className="grid grid-cols-[1fr_140px_120px_130px] items-center gap-4 border-b border-border px-4 py-4 max-md:grid-cols-1">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image src={gambar} alt={namaKos} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-primary">{namaKos}</p>
                        <p className="text-xs text-text-secondary">{kamarNama} ({kamarDetail})</p>
                    </div>
                </div>
                <p className="text-sm text-text-primary max-md:text-xs max-md:text-text-secondary md:text-center">{tanggalMasuk}</p>
                <div className="md:flex md:justify-center">
                    <span className={`rounded-md px-3 py-1 text-xs font-semibold ${statusStyle[status]}`}>{t(statusKey[status])}</span>
                </div>
                <p className="text-sm font-bold text-primary md:text-right">{formatHarga(harga)}</p>
            </div>
        </div>
    );
}
