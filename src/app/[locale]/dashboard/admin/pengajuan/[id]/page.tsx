import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { createClient } from "@/lib/supabase/server";
import { getPengajuanDetail } from "@/lib/db/queries";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ApproveButton, RejectButton } from "../ReviewActions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-text-secondary">{label}</p>
      <p className="mt-0.5 text-sm text-text-primary">{value ?? "-"}</p>
    </div>
  );
}

function formatTanggal(iso: string | null): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

const statusBadge: Record<string, string> = {
  menunggu_verifikasi: "bg-warning text-white",
  disetujui: "bg-success text-white",
  ditolak: "bg-error text-white",
};

const statusKey: Record<string, string> = {
  menunggu_verifikasi: "waitingBadge",
  disetujui: "approved",
  ditolak: "rejected",
};

export default async function PengajuanDetailPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("PengajuanDetail");
  const ta = await getTranslations("AdminPengajuan");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin/pengajuan");
  let role: string | null = null;
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
    role = ((data?.[0] as { role?: string } | undefined)?.role ?? null)?.toLowerCase() ?? null;
  } catch {}
  if (role !== "admin") redirect("/");

  const pengajuan = await getPengajuanDetail(id);
  if (!pengajuan) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebarUserWrapper />
        <div className="flex flex-1 flex-col">
          <DashboardNavbar title={t("title")} />
          <main className="flex-1 p-6">
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">{t("notFound")}</p>
              <Link href="/dashboard/admin/pengajuan" className="mt-3 inline-block text-xs font-semibold text-primary hover:text-primary-dark">{t("back")}</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  let dokumenUrl: string | null = null;
  if (pengajuan.dokumen_url) {
    const { data: signed } = await supabase.storage
      .from("dokumen-pengajuan")
      .createSignedUrl(pengajuan.dokumen_url, 3600);
    dokumenUrl = signed?.signedUrl ?? null;
  }

  const isPending = pengajuan.status === "menunggu_verifikasi";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            <Link href="/dashboard/admin/pengajuan" className="text-xs font-semibold text-primary hover:text-primary-dark">{t("back")}</Link>

            <section className="rounded-2xl bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-base font-bold text-text-primary">{pengajuan.nama_lengkap}</h2>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${statusBadge[pengajuan.status] ?? "bg-warning text-white"}`}>
                  {ta(statusKey[pengajuan.status] ?? "waitingBadge")}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">{t("submitted", { date: formatTanggal(pengajuan.created_at) })}</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label={t("wa")} value={pengajuan.no_hp} />
                <Field label={t("address")} value={pengajuan.alamat} />
              </div>
              <div className="mt-4">
                <Field label={t("reason")} value={pengajuan.alasan} />
              </div>
              <div className="mt-4">
                <Field label={t("info")} value={pengajuan.info_kos} />
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-text-secondary">{t("doc")}</p>
                {dokumenUrl ? (
                  <a href={dokumenUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-block text-sm font-semibold text-primary hover:text-primary-dark">
                    {t("viewDoc")}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm text-text-secondary">{t("noDoc")}</p>
                )}
              </div>

              {!isPending && (
                <div className="mt-4 rounded-xl border border-border bg-background p-4">
                  <p className="text-[10px] font-semibold text-text-secondary">{t("decision")}</p>
                  <p className="mt-1 text-xs text-text-primary">
                    {t("decidedOn", { date: formatTanggal(pengajuan.diverifikasi_at) })}
                    {pengajuan.alasan_tolak ? t("rejectReason", { reason: pengajuan.alasan_tolak }) : ""}
                  </p>
                </div>
              )}

              {isPending && (
                <div className="mt-5 flex gap-2 border-t border-border pt-4">
                  <ApproveButton pengajuanId={pengajuan.id} />
                  <RejectButton pengajuanId={pengajuan.id} />
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
