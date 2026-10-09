import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getMyPemesanan, type StatusPemesanan } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IconBed } from "@tabler/icons-react";
import { CancelButton } from "@/app/[locale]/dashboard/pemilik/reservasi/PemesananActions";

const badgeStyle: Record<StatusPemesanan, string> = {
  menunggu: "bg-warning text-white",
  dikonfirmasi: "bg-success text-white",
  ditolak: "bg-error text-white",
  dibatalkan: "bg-gray-300 text-gray-600",
};

const statusKey: Record<StatusPemesanan, string> = {
  menunggu: "statusMenunggu",
  dikonfirmasi: "statusDikonfirmasi",
  ditolak: "statusDitolak",
  dibatalkan: "statusDibatalkan",
};

function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function ReservasiPage() {
  const t = await getTranslations("Reservasi");
  const list = await getMyPemesanan();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("reservasiTitle")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {list.length === 0 ? (
              <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
                <p className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
                  <IconBed size={30} stroke={1.5} className="text-primary" />
                </p>
                <h2 className="mt-4 font-heading text-base font-bold text-text-primary">
                  {t("reservasiEmpty")}
                </h2>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-text-secondary">
                  {t("reservasiDesc")}
                </p>
                <Link
                  href="/cari-kos"
                  className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {t("cta")}
                </Link>
              </div>
            ) : (
              list.map((p) => (
                <div key={p.id} className="rounded-2xl bg-surface p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-base font-bold text-text-primary">{p.kos_nama}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {p.kamar_nama} · {t("moveIn", { date: formatTanggal(p.tanggal_mulai), n: p.durasi })}
                      </p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {formatHarga(p.total_harga)}
                      </p>
                      <p className="mt-1 text-[10px] text-text-secondary">{t("bookedAt", { date: formatTanggal(p.created_at) })}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${badgeStyle[p.status]}`}>
                      {t(statusKey[p.status])}
                    </span>
                  </div>
                  {p.status === "menunggu" && (
                    <div className="mt-3 border-t border-border pt-3">
                      <CancelButton pemesananId={p.id} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
