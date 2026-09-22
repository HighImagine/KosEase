import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getMyKosList } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";

export default async function PemilikPage() {
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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Dashboard Pemilik Kos" />

        <main className="flex-1 p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Profil Kos</h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Profil Info */}
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <h3 className="font-heading text-base font-bold text-text-primary mb-4">Informasi Profil</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-secondary">Nama Lengkap</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{fullName ?? displayName ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{user?.email ?? "-"}</p>
                </div>
              </div>
            </div>

            {/* List Kos */}
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-text-primary">Kos yang Terdaftar</h3>
                <Link href="/dashboard/pemilik/kos" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">Kelola</Link>
              </div>
              <div className="space-y-3">
                {kosList.length === 0 ? (
                  <p className="text-sm text-text-secondary">Belum ada kos yang terdaftar.</p>
                ) : (
                  kosList.slice(0, 5).map((kos) => (
                    <Link key={kos.id_kos} href={`/dashboard/pemilik/kos/${kos.id_kos}`} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 hover:border-primary">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{kos.nama}</p>
                        <p className="mt-0.5 text-[10px] text-text-secondary">{kos.lokasi} · {formatHarga(kos.harga)}/bln</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"}`}>
                        {kos.status_publikasi === "tayang" ? "Tayang" : "Draft"}
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
