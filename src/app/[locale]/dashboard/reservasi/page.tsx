import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IconBed, IconSearch, IconPencil, IconClock } from "@tabler/icons-react";

export default async function ReservasiPage() {
  const t = await getTranslations("Reservasi");
  const steps = [
    { icon: IconSearch, text: t("howStep1") },
    { icon: IconPencil, text: t("howStep2") },
    { icon: IconClock, text: t("howStep3") },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("reservasiTitle")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {/* Empty state */}
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


          </div>
        </main>
      </div>
    </div>
  );
}
