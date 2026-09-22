import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";

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
              <h3 className="font-heading text-base font-bold text-text-primary mb-4">Kos yang Terdaftar</h3>
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">Belum ada kos yang terdaftar.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
