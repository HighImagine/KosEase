import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarWrapper";
import StatTile from "@/components/StatTile";
import { createClient } from "@/lib/supabase/server";
import { getAllUsersForAdmin } from "@/lib/db/queries";
import { getTranslations } from "next-intl/server";
import UserRoleForm from "./UserRoleForm";

export default async function AdminPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string }>;
}) {
  const t = await getTranslations("AdminPengguna");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin/pengguna");
  let role: string | null = null;
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
    role = ((data?.[0] as { role?: string } | undefined)?.role ?? null)?.toLowerCase() ?? null;
  } catch {}
  if (role !== "admin") redirect("/");

  const [users, sp] = await Promise.all([getAllUsersForAdmin(), searchParams]);
  const penyewaCount = users.filter((u) => {
    const r = (u.role ?? "").toLowerCase();
    return r !== "admin" && r !== "pemilik" && r !== "pemilik_kos";
  }).length;
  const pemilikCount = users.filter((u) => {
    const r = (u.role ?? "").toLowerCase();
    return r === "pemilik" || r === "pemilik_kos";
  }).length;
  const adminCount = users.filter((u) => (u.role ?? "").toLowerCase() === "admin").length;

  const formatTanggal = (iso: string | null): string => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "-";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-bold text-text-primary">{t("heading")}</h2>
              <p className="mt-0.5 text-xs text-text-secondary">{t("subtitle")}</p>
            </div>
            {sp.updated === "1" && (
              <span className="rounded-lg bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">
                {t("updatedNotice")}
              </span>
            )}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile value={users.length} label={t("statTotal")} />
            <StatTile value={penyewaCount} label={t("rolePenyewa")} />
            <StatTile value={pemilikCount} label={t("rolePemilik")} />
            <StatTile value={adminCount} label={t("roleAdmin")} />
          </div>

          {users.length === 0 ? (
            <div className="rounded-xl bg-surface p-8 text-center text-sm text-text-secondary">
              {t("empty")}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u) => {
                const norm = (u.role ?? "penyewa").toLowerCase();
                const isPemilik = norm === "pemilik" || norm === "pemilik_kos";
                return (
                  <div
                    key={u.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {u.full_name || t("noName")}
                        </p>
                        {isPemilik && u.diverifikasi_at && (
                          <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                            {t("verifiedAt", { date: formatTanggal(u.diverifikasi_at) })}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {u.phone ?? "-"} · {t("joined", { date: formatTanggal(u.created_at) })}
                      </p>
                    </div>
                    <UserRoleForm userId={u.id} currentRole={u.role ?? "penyewa"} />
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
