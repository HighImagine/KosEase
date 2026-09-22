import { createClient } from "@/lib/supabase/server";
import DashboardSidebarUser from "./DashboardSidebarUser";

export default async function DashboardSidebarUserWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  let userRole: string | null = null;
  if (user) {
    displayName = (user.user_metadata?.full_name as string) ?? null;
    avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
    try {
      const { data: profileData } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", user.id).limit(1);
      const profileDatum = profileData?.[0];
      if (profileDatum) {
        displayName = (profileDatum.full_name as string) ?? displayName;
        if (profileDatum.avatar_url) avatarUrl = profileDatum.avatar_url as string;
        userRole = (profileDatum.role as string) ?? null;
      }
    } catch {}
    if (!displayName) displayName = "Pengguna";
  }

  return (
    <DashboardSidebarUser
      userName={displayName}
      userAvatar={avatarUrl}
      userEmail={user?.email ?? null}
      userRole={userRole}
    />
  );
}
