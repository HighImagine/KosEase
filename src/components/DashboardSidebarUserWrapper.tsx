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
      const { data } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", user.id).single();
      if (data) {
        displayName = (data.full_name as string) ?? displayName;
        if (data.avatar_url) avatarUrl = data.avatar_url as string;
        userRole = (data.role as string) ?? null;
      }
    } catch {}
    if (!displayName) displayName = user.email?.split("@")[0] ?? "Pengguna";
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
