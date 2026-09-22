"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IconArrowRight } from "@tabler/icons-react";

type PengajuanCardProps = {
    status: "belum_mengajukan" | "menunggu" | "disetujui" | "ditolak";
};

export default function PengajuanCard({
    status,
}: PengajuanCardProps) {
    const t = useTranslations("PengajuanCard");
    // Belum pernah mengajukan
    if (status === "belum_mengajukan") {
        return (
            <div className="rounded-xl bg-primary-light p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-heading text-base font-bold text-text-primary">
                            {t("ctaTitleA")}
                            <br />
                            {t("ctaTitleB")}
                        </h2>

                        <p className="mt-2 max-w-sm font-body text-xs leading-relaxed text-text-secondary">
                            {t("ctaDesc")}
                        </p>

                        <Link
                            href="/dashboard/pengajuan-pemilik"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body text-xs text-white transition-colors hover:bg-primary-dark"
                        >
                            {t("ctaButton")}
                            <IconArrowRight size={16} stroke={2} color="#ffffff" />
                        </Link>
                    </div>

                    <div className="shrink-0">
                        <Image
                            src="/img/pengajuan-kos.svg"
                            alt="Daftarkan kos"
                            width={150}
                            height={130}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Sudah mengajukan dan sedang ditinjau
    if (status === "menunggu") {
        return (
            <div className="rounded-xl bg-primary p-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-body">
                            {t("cardTitle")}
                        </h2>

                        <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 font-body text-[10px] font-semibold">
                            {t("pendingBadge")}
                        </span>

                        <p className="mt-3 max-w-sm font-body text-xs leading-relaxed text-white/80">
                            {t("pendingDesc")}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Image
                            src="/img/pengajuan-kos.svg"
                            alt="Pengajuan pemilik kos"
                            width={140}
                            height={120}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Sudah disetujui
    if (status === "disetujui") {
        return (
            <div className="rounded-xl bg-primary-light p-5">
                <h2 className="font-heading text-base font-bold text-text-primary">
                    {t("cardTitle")}
                </h2>

                <span className="mt-2 inline-block rounded-full bg-success/10 px-3 py-1 font-body text-[10px] font-semibold text-success">
                    {t("approvedBadge")}
                </span>

                <p className="mt-3 font-body text-xs text-text-secondary">
                    {t("approvedDesc")}
                </p>

                <Link
                    href="/dashboard/pemilik"
                    className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 font-body text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                    {t("approvedCta")}
                </Link>
            </div>
        );
    }

    // Ditolak
    return (
        <div className="rounded-xl bg-surface p-5 ring-1 ring-error/20">
            <h2 className="font-heading text-base font-bold text-text-primary">
                {t("cardTitle")}
            </h2>

            <span className="mt-2 inline-block rounded-full bg-error/10 px-3 py-1 font-body text-[10px] font-semibold text-error">
                {t("rejectedBadge")}
            </span>

            <p className="mt-3 font-body text-xs text-text-secondary">
                {t("rejectedDesc")}
            </p>

            <Link
                href="/dashboard/pengajuan-pemilik"
                className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 font-body text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            >
                {t("rejectedCta")}
            </Link>
        </div>
    );
}
