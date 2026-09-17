import { createClient } from "@/lib/supabase/server";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role: string | null = null;
  let displayName: string | null = null;
  if (user) {
    displayName = (user.user_metadata?.nama_lengkap as string) ?? user.email?.split("@")[0] ?? null;
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = (data?.role as string) ?? "pencari";
  }
  return <Navbar user={user ? { email: user.email!, displayName, role } : null} />;
}
