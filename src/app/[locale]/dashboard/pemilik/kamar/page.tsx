import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarWrapper";
import EmptyStateCard from "@/components/EmptyStateCard";
import { getMyKamarBoard, type KamarMilik } from "@/lib/db/queries";
import type { Kos } from "@/lib/db/types";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IconBed, IconCircleCheck, IconCircleX, IconStack2 } from "@tabler/icons-react";
import KamarFilter from "./KamarFilter";
import KamarBoard from "./KamarBoard";

type PageProps = {
  searchParams: Promise<{ q?: string; kos?: string; status?: string }>;
};

type KamarGroup = { kos: Kos; kamar: KamarMilik[] };

function matchesText(fields: string[], keyword: string): boolean {
  if (!keyword) return true;
  return fields.some((f) => f.toLowerCase().includes(keyword));
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
        <p className="font-heading text-lg font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export default async function KelolaKamarPage({ searchParams }: PageProps) {
  const { q, kos: kosParam, status } = await searchParams;
  const t = await getTranslations("KamarList");
  const to = await getTranslations("OwnerOnboarding");
  const { kos, kamar } = await getMyKamarBoard();

  const keyword = (q ?? "").trim().toLowerCase();
  const kosFilter = kosParam ?? "semua";
  const statusFilter = status ?? "semua";

  const statusOk = (k: KamarMilik) =>
    statusFilter === "semua" || (statusFilter === "tersedia" ? k.stok > 0 : k.stok <= 0);

  const groups: KamarGroup[] = kos
    .filter((k) => kosFilter === "semua" || k.id_kos === kosFilter)
    .map((k) => {
      const kosMatch = matchesText([k.nama, k.lokasi, k.tipe], keyword);
      const rows = kamar
        .filter((r) => r.kos_id === k.id_kos && statusOk(r))
        .filter((r) => kosMatch || matchesText([r.nama, r.ukuran ?? ""], keyword));
      return { kos: k, kamar: rows };
    })
    // Grup kos tanpa kamar tetap tampil (agar bisa langsung tambah) selama
    // tidak sedang mencari atau memfilter status.
    .filter((g) => g.kamar.length > 0 || (!keyword && statusFilter === "semua"));

  const visible = groups.flatMap((g) => g.kamar);
  const stats = {
    tipe: visible.length,
    stok: visible.reduce((sum, k) => sum + k.stok, 0),
    tersedia: visible.filter((k) => k.stok > 0).length,
    penuh: visible.filter((k) => k.stok <= 0).length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-1">{t("heading")}</h2>
            <p className="mb-4 text-xs text-text-secondary">{t("desc")}</p>

            {kos.length === 0 ? (
              <EmptyStateCard
                variant="compact"
                title={t("emptyTitle")}
                description={t("empty")}
                ctaLabel={to("cta")}
                ctaHref="/dashboard/pemilik/kos/tambah"
              />
            ) : (
              <>
                <KamarFilter key={`${q ?? ""}|${kosFilter}|${statusFilter}`} kos={kos} />

                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard icon={<IconBed size={18} stroke={2} />} label={t("statsTipe")} value={stats.tipe} />
                  <StatCard icon={<IconStack2 size={18} stroke={2} />} label={t("statsStok")} value={stats.stok} />
                  <StatCard icon={<IconCircleCheck size={18} stroke={2} />} label={t("statsAvailable")} value={stats.tersedia} />
                  <StatCard icon={<IconCircleX size={18} stroke={2} />} label={t("statsFull")} value={stats.penuh} />
                </div>

                {groups.length === 0 ? (
                  <div className="rounded-xl bg-surface p-8 text-center shadow-sm">
                    <p className="font-heading text-sm font-bold text-text-primary">{t("noResult")}</p>
                    <p className="mt-1 text-xs text-text-secondary">{t("noResultDesc")}</p>
                    <Link
                      href="/dashboard/pemilik/kamar"
                      className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
                    >
                      {t("resetFilter")}
                    </Link>
                  </div>
                ) : (
                  <KamarBoard groups={groups} kosList={kos} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
