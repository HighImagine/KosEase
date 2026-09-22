import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";
import NotificationBell from "./NotificationBell";

export default async function NavbarWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  let pendingCount = 0;

  if (user) {
    displayName = (user.user_metadata?.full_name as string)?.split(" ")[0] ?? null;
    avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
    const { data: profileData } = await supabase.from("profiles").select("role, avatar_url").eq("id", user.id).limit(1);
    const profileDatum = profileData?.[0];
    role = (profileDatum?.role as string) ?? "penyewa";
    if (profileDatum?.avatar_url) avatarUrl = profileDatum.avatar_url as string;
    if (role === "admin") {
      const { count } = await supabase.from("pengajuan_pemilik").select("*", { count: "exact", head: true }).eq("status", "menunggu_verifikasi");
      pendingCount = count ?? 0;
    }
  }

  return (
    <Navbar
      user={user ? { email: user.email!, displayName, role } : null}
      avatarUrl={avatarUrl}
      pendingCount={pendingCount}
    />
  );
}
