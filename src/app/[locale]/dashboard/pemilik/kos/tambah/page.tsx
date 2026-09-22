import DashboardNavbar from "@/components/DashboardNavbar";
import { createKosAction } from "@/app/[locale]/kos/actions";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import KosForm from "../KosForm";

export default async function TambahKosPage() {
  const t = await getTranslations("KosForm");
  const tk = await getTranslations("KelolaKos");
  // Tanpa sidebar: halaman form fokus penuh.
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar title={tk("addTitle")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-xl">
            <Link href="/dashboard/pemilik/kos" className="text-xs font-semibold text-primary hover:text-primary-dark">{tk("backToList")}</Link>
            <div className="mt-3 rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-text-primary">{t("newTitle")}</h2>
              <p className="mt-1 text-xs text-text-secondary">{t("newDesc")}</p>
              <div className="mt-5">
                <KosForm action={createKosAction} />
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
