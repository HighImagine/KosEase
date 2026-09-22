import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import ProfileForm from "@/components/ProfileForm";
import { getTranslations } from "next-intl/server";

export default async function ProfilPage() {
  const t = await getTranslations("Profile");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  let email: string | null = null;
  let userRole = "Penyewa";
  let initialValues: { currentFullName?: string; currentEmail?: string; currentPhone?: string; currentAvatar?: string | null } = { currentAvatar: null };

if (user) {
    displayName = (user.user_metadata?.full_name as string)?.split(" ")[0] ?? "Penyewa";
    avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
    email = user.email ?? null;
    let phoneFromProfile: string | null = null;
    try {
      const { data } = await supabase.from("profiles").select("full_name, avatar_url, role, phone").eq("id", user.id).single();
      if (data) {
        displayName = (data.full_name as string) ?? displayName;
        avatarUrl = (data.avatar_url as string) ?? avatarUrl;
        phoneFromProfile = (data.phone as string) ?? null;
        const r = (data.role as string)?.toLowerCase();
        if (r === "pemilik" || r === "pemilik_kos") userRole = "Pemilik Kos";
        else if (r === "admin") userRole = "Admin";
        else userRole = "Penyewa";
      }
    } catch {}
    initialValues = { currentFullName: displayName ?? undefined, currentEmail: email ?? undefined, currentPhone: phoneFromProfile ?? undefined, currentAvatar: avatarUrl ?? null };
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
<DashboardNavbar title={t("title")} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                {t("cardTitle")}
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                {t("cardDesc")}
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
