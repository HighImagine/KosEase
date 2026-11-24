import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarWrapper";
import { getMasukPerpanjangan, getMasukReservasi, type StatusPemesanan } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { ConfirmButton, RejectButton } from "./PemesananActions";
import { ExtensionDecision } from "./PerpanjanganActions";

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

export default async function ReservasiMasukPage() {
  const t = await getTranslations("ReservasiMasuk");
  const tr = await getTranslations("Reservasi");
  const list = await getMasukReservasi();
  const extensions = await getMasukPerpanjangan();
  const menunggu = list.filter((p) => p.status === "menunggu");
  const riwayat = list.filter((p) => p.status !== "menunggu");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <p className="text-xs text-text-secondary">{t("desc")}</p>

            {extensions.filter((item) => item.status === "menunggu").map((item) => (
              <div key={item.id} className="rounded-xl border border-primary/30 bg-surface p-5 shadow-sm">
                <p className="font-semibold text-text-primary">Pengajuan perpanjangan</p>
                <p className="mt-1 text-xs text-text-secondary">Tambahan {item.tambahan_bulan} bulan.</p>
                <ExtensionDecision id={item.id} />
              </div>
            ))}

            {list.length === 0 ? (
              <div className="rounded-xl bg-surface p-8 text-center">
                <p className="text-sm text-text-secondary">{t("empty")}</p>
              </div>
            ) : (
              <>
                {menunggu.map((p) => (
                  <div key={p.id} className="rounded-xl border border-warning/40 bg-surface p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-base font-bold text-text-primary">{p.kos_nama} — {p.kamar_nama}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {t("renter")}: {p.nama_pemesan} · {p.no_wa}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {t("moveIn", { date: formatTanggal(p.tanggal_mulai), n: p.durasi })} · {formatHarga(p.total_harga)}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">{t("stockLeft", { n: Math.max(0, p.kamar_stok ?? 0) })}</p>
                        {p.catatan && <p className="mt-1 text-xs italic text-text-secondary">“{p.catatan}”</p>}
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${badgeStyle[p.status]}`}>
                        {tr(statusKey[p.status])}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2 border-t border-border pt-3">
                      <ConfirmButton pemesananId={p.id} stok={p.kamar_stok} />
                      <RejectButton pemesananId={p.id} />
                    </div>
                  </div>
                ))}

                {riwayat.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {p.kos_nama} — {p.kamar_nama}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {p.nama_pemesan} · {t("moveIn", { date: formatTanggal(p.tanggal_mulai), n: p.durasi })} · {formatHarga(p.total_harga)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${badgeStyle[p.status]}`}>
                      {tr(statusKey[p.status])}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
