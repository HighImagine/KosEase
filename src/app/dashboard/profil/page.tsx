import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  let email: string | null = null;
  let userRole = "Penyewa";
  let initialValues: { currentName?: string; currentEmail?: string; currentPhone?: string; currentAvatar?: string | null } = { currentAvatar: null };

if (user) {
    displayName = (user.user_metadata?.nama_lengkap as string) ?? user.email?.split("@")[0] ?? "Penyewa";
    avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
    email = user.email ?? null;
    let phoneFromProfile: string | null = null;
    try {
      const { data } = await supabase.from("profiles").select("full_name, nama_lengkap, avatar_url, role, phone").eq("id", user.id).single();
      if (data) {
        displayName = (data.full_name as string) ?? (data.nama_lengkap as string) ?? displayName;
        avatarUrl = (data.avatar_url as string) ?? avatarUrl;
        phoneFromProfile = (data.phone as string) ?? null;
        const r = (data.role as string)?.toLowerCase();
        if (r === "pemilik" || r === "pemilik_kos") userRole = "Pemilik Kos";
        else if (r === "admin") userRole = "Admin";
        else userRole = "Penyewa";
      }
    } catch {}
    initialValues = { currentName: displayName ?? undefined, currentEmail: email ?? undefined, currentPhone: phoneFromProfile ?? undefined, currentAvatar: avatarUrl ?? null };
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar
          title="Profil Saya"
          userName={displayName ?? "Tamu"}
          userRole={userRole}
          userImage={avatarUrl}
        />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                Edit Profil
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                Perbarui informasi pribadi dan foto profil Anda.
              </p>

              <div className="mt-6">
                <ProfileForm initialValues={initialValues} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
