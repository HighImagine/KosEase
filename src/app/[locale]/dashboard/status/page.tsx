import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IconRadar } from "@tabler/icons-react";

export default async function StatusPage() {
  const t = await getTranslations("Reservasi");
  const stages = [
    { n: "1", title: t("step1"), desc: t("step1d") },
    { n: "2", title: t("step2"), desc: t("step2d") },
    { n: "3", title: t("step3"), desc: t("step3d") },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("statusTitle")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {/* Lifecycle tracker (ilustratif — aktif saat backend booking ada) */}
            <div className="rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-base font-bold text-text-primary">{t("statusTitle")}</h2>
              <p className="mt-1 text-xs text-text-secondary">{t("statusDesc")}</p>
              <div className="mt-5">
                {stages.map((s, i) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <p className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-background font-heading text-sm font-bold text-text-secondary">
                        {s.n}
                      </p>
                      {i < stages.length - 1 && <span className="w-0.5 flex-1 bg-border" />}
                    </div>
                    <div className={i < stages.length - 1 ? "pb-6" : ""}>
                      <p className="text-sm font-semibold text-text-primary">{s.title}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty state */}
            <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
              <p className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
                <IconRadar size={30} stroke={1.5} className="text-primary" />
              </p>
              <p className="mt-4 text-sm font-semibold text-text-primary">{t("trackingEmpty")}</p>
              <Link
                href="/cari-kos"
                className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
