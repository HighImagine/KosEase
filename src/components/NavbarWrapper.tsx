import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";
import { getNotificationBellSummary } from "@/lib/db/notification-bell";
import type { NotificationBellSummary } from "@/lib/db/notification-bell";

export default async function NavbarWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  let notification: NotificationBellSummary | null = null;

  if (user) {
    displayName = (user.user_metadata?.full_name as string)?.split(" ")[0] ?? null;
    avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
    const { data: profileData } = await supabase.from("profiles").select("role, avatar_url").eq("id", user.id).limit(1);
    const profileDatum = profileData?.[0];
    role = (profileDatum?.role as string) ?? "penyewa";
    if (profileDatum?.avatar_url) avatarUrl = profileDatum.avatar_url as string;
    notification = await getNotificationBellSummary(role, user.id);
  }

  return (
    <Navbar
      user={user ? { email: user.email!, displayName, role } : null}
      avatarUrl={avatarUrl}
      notification={notification}
    />
  );
}
