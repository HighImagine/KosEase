import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarWrapper";
import { getMasukReservasi, getMyKosList } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PemilikPage() {
  const t = await getTranslations("PemilikHome");
  const tk = await getTranslations("KelolaKos");
  const tr = await getTranslations("Reservasi");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let fullName: string | null = null;

  if (user) {
    displayName = (user.user_metadata?.full_name as string)?.split(" ")[0] ?? "-";
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    fullName = (profile?.full_name as string) ?? null;
  }

  const kosList = await getMyKosList();
  const masuk = await getMasukReservasi();
  const menungguCount = masuk.filter((p) => p.status === "menunggu").length;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-4">{t("heading")}</h2>

          {/* Reservasi Masuk */}
          <div className="mb-6 rounded-xl bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-text-primary">
                {t("reservasiTitle")}{" "}
                {menungguCount > 0 && (
                  <span className="ml-1 rounded-full bg-warning px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {t("reservasiWaiting", { n: menungguCount })}
                  </span>
                )}
              </h3>
              <Link href="/dashboard/pemilik/reservasi" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">{t("reservasiCta")}</Link>
            </div>
            {masuk.length === 0 ? (
              <p className="text-sm text-text-secondary">{t("reservasiEmpty")}</p>
            ) : (
              <div className="space-y-3">
                {masuk.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{p.kos_nama} — {p.kamar_nama}</p>
                      <p className="mt-0.5 text-[10px] text-text-secondary">{p.nama_pemesan} · {formatHarga(p.total_harga)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${p.status === "menunggu" ? "bg-warning" : p.status === "dikonfirmasi" ? "bg-success" : p.status === "ditolak" ? "bg-error" : "bg-gray-300 text-gray-600"}`}>
                      {p.status === "menunggu" ? tr("statusMenunggu") : p.status === "dikonfirmasi" ? tr("statusDikonfirmasi") : p.status === "ditolak" ? tr("statusDitolak") : tr("statusDibatalkan")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Profil Info */}
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <h3 className="font-heading text-base font-bold text-text-primary mb-4">{t("infoTitle")}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-secondary">{t("fullName")}</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{fullName ?? displayName ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{t("email")}</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{user?.email ?? "-"}</p>
                </div>
              </div>
            </div>

            {/* List Kos */}
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-text-primary">{t("kosTitle")}</h3>
                <Link href="/dashboard/pemilik/kos" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">{t("manage")}</Link>
              </div>
              <div className="space-y-3">
                {kosList.length === 0 ? (
                  <p className="text-sm text-text-secondary">{t("empty")}</p>
                ) : (
                  kosList.slice(0, 5).map((kos) => (
                    <Link key={kos.id_kos} href={`/dashboard/pemilik/kos/${kos.id_kos}`} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 hover:border-primary">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{kos.nama}</p>
                        <p className="mt-0.5 text-[10px] text-text-secondary">{kos.lokasi} · {formatHarga(kos.harga)}{t("perMonth")}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"}`}>
                        {kos.status_publikasi === "tayang" ? tk("tayang") : tk("draft")}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
