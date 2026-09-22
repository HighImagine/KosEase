import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminKosStats,
  getAllKosForAdmin,
  getRecentPendingPengajuan,
  getUserRoleCounts,
} from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
      <p className="font-heading text-xl font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}

function PreviewSection({
  title,
  desc,
  href,
  linkLabel,
  children,
}: {
  title: string;
  desc: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-base font-bold text-text-primary">{title}</h2>
          <p className="mt-1 text-xs text-text-secondary">{desc}</p>
        </div>
        <Link href={href} className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">
          {linkLabel}
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

export default async function AdminBerandaPage() {
  const t = await getTranslations("AdminHome");
  const tc = await getTranslations("Common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin");
  let role: string | null = null;
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
    role = ((data?.[0] as { role?: string } | undefined)?.role ?? null)?.toLowerCase() ?? null;
  } catch {}
  if (role !== "admin") redirect("/");

  const [stats, roleCounts, pending, allKos] = await Promise.all([
    getAdminKosStats(),
    getUserRoleCounts(),
    getRecentPendingPengajuan(3),
    getAllKosForAdmin(),
  ]);
  const draftKos = allKos.filter((k) => k.status_publikasi !== "tayang").slice(0, 3);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {/* 1. Snapshot platform */}
            <section className="rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-base font-bold text-text-primary">{t("snapshot")}</h2>
              <p className="mt-1 text-xs text-text-secondary">{t("clickHint")}</p>
              <div className="mt-4 grid grid-cols-2 items-start gap-3 sm:grid-cols-4">
                <Link href="/dashboard/admin/kos" title={t("snapshot")} className="block">
                  <StatTile value={stats.total} label={t("statTotal")} />
                </Link>
                <Link href="/dashboard/admin/kos" title={t("snapshot")} className="block">
                  <StatTile value={stats.tayang} label={t("statTayang")} />
                </Link>
                <Link href="/dashboard/admin/kos" title={t("snapshot")} className="block">
                  <StatTile value={stats.draft} label={t("statDraft")} />
                </Link>
                <details className="rounded-xl border border-border bg-background">
                  <summary title={t("clickHint")} className="cursor-pointer list-none px-4 py-3 text-center [&::-webkit-details-marker]:hidden">
                    <p className="font-heading text-xl font-bold text-primary">{stats.pengajuanPending}</p>
                    <p className="mt-0.5 text-[10px] text-text-secondary">{t("statPending")} ▾</p>
                  </summary>
                  <div className="space-y-2 border-t border-border p-3">
                    {pending.length === 0 ? (
                      <p className="text-center text-[11px] text-text-secondary">{t("noPending")}</p>
                    ) : (
                      pending.map((p) => (
                        <div key={p.id} className="rounded-lg bg-surface px-3 py-2">
                          <p className="truncate text-[11px] font-semibold text-text-primary">{p.nama_lengkap}</p>
                          <p className="mt-0.5 text-[10px] text-text-secondary">{p.no_hp ?? "-"} · {formatTanggal(p.created_at)}</p>
                        </div>
                      ))
                    )}
                    <Link href="/dashboard/admin/pengajuan" className="block text-center text-[11px] font-semibold text-primary hover:text-primary-dark">
                      {t("verifyAll")}
                    </Link>
                  </div>
                </details>
              </div>
            </section>

            {/* 2. Preview Kelola Pengguna */}
            <PreviewSection
              title={t("usersTitle")}
              desc={`${roleCounts.total} user`}
              href="/dashboard/admin/pengguna"
              linkLabel={t("manage")}
            >
              <div className="grid grid-cols-3 gap-3">
                <StatTile value={roleCounts.penyewa} label={t("statPenyewa")} />
                <StatTile value={roleCounts.pemilik} label={t("statPemilik")} />
                <StatTile value={roleCounts.admin} label={t("statAdmin")} />
              </div>
            </PreviewSection>

            {/* 3. Preview Verifikasi Pemilik Kos */}
            <PreviewSection
              title={t("verifyOwner")}
              desc={pending.length === 0 ? t("noQueue") : t("pendingCount", { n: stats.pengajuanPending })}
              href="/dashboard/admin/pengajuan"
              linkLabel={t("verify")}
            >
              {pending.length === 0 ? (
                <p className="text-xs text-text-secondary">{t("noPending")}</p>
              ) : (
                <div className="space-y-2">
                  {pending.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{p.nama_lengkap}</p>
                        <p className="mt-0.5 text-[10px] text-text-secondary">{p.no_hp ?? "-"} · {formatTanggal(p.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-warning px-3 py-1 text-[10px] font-semibold text-white">{t("waiting")}</span>
                    </div>
                  ))}
                </div>
              )}
            </PreviewSection>

            {/* 4. Preview Publikasi Kos */}
            <PreviewSection
              title={t("pubTitle")}
              desc={draftKos.length === 0 ? t("allTayang") : t("draftCount", { n: stats.draft })}
              href="/dashboard/admin/kos"
              linkLabel={t("moderate")}
            >
              {draftKos.length === 0 ? (
                <p className="text-xs text-text-secondary">{t("noDraft")}</p>
              ) : (
                <div className="space-y-2">
                  {draftKos.map((k) => (
                    <div key={k.id_kos} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{k.nama}</p>
                        <p className="mt-0.5 text-[10px] text-text-secondary">{k.lokasi} · {formatHarga(k.harga)}{tc("perMonthShort")}</p>
                      </div>
                      <span className="rounded-full bg-warning px-3 py-1 text-[10px] font-semibold text-white">{t("statDraft")}</span>
                    </div>
                  ))}
                </div>
              )}
            </PreviewSection>
          </div>
        </main>
      </div>
    </div>
  );
}
