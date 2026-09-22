import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getTranslations } from "next-intl/server";
import PengajuanForm from "./PengajuanForm";

export default async function PengajuanPemilik() {
    const t = await getTranslations("PengajuanForm");
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUserWrapper />

            <div className="flex flex-1 flex-col">
<DashboardNavbar title={t("title")} />

                <main className="flex-1 p-6">
                    <div className="rounded-xl border border-primary-light bg-primary-light p-5">
                        <div className="flex gap-4">
                            <Image src="/img/favicon.png" alt="" width={32} height={32} />
                            <div>
                                <h2 className="text-sm font-bold text-primary">{t("bannerTitle")}</h2>
                                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{t("bannerDesc")}</p>
                            </div>
                        </div>
                    </div>

                    <PengajuanForm />
                </main>
            </div>
        </div>
    )
}
