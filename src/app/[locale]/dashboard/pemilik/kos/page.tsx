import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getMyKosList } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DeleteKosButton, PublikasiToggle } from "./KosListActions";

export default async function KelolaKosPage() {
  const t = await getTranslations("KelolaKos");
  const tc = await getTranslations("Common");
  const kosList = await getMyKosList();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-text-primary">{t("heading")}</h2>
            <Link href="/dashboard/pemilik/kos/tambah" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
              {t("add")}
            </Link>
          </div>

          {kosList.length === 0 ? (
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">{t("empty")}</p>
              <Link href="/dashboard/pemilik/kos/tambah" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
                {t("add")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {kosList.map((kos) => (
                <div key={kos.id_kos} className="rounded-xl bg-surface p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-base font-bold text-text-primary">{kos.nama}</h3>
                      <p className="mt-0.5 text-xs text-text-secondary">{kos.lokasi} · {kos.tipe}</p>
                      <p className="mt-1 text-sm font-bold text-primary">{formatHarga(kos.harga)}<span className="text-xs font-normal text-text-secondary"> {tc("perMonth")}</span></p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold text-white ${kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"}`}>
                      {kos.status_publikasi === "tayang" ? t("tayang") : t("draft")}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/pemilik/kos/${kos.id_kos}`} className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">
                      {t("manage")}
                    </Link>
                    {kos.status_publikasi === "tayang" && (
                      <Link href={`/kos/${kos.id_kos}`} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary">
                        {t("viewPublic")}
                      </Link>
                    )}
                    <PublikasiToggle kosId={kos.id_kos} status={kos.status_publikasi} />
                    <DeleteKosButton kosId={kos.id_kos} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
