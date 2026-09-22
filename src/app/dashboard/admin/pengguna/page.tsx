import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { createClient } from "@/lib/supabase/server";

// Placeholder Kelola Pengguna — daftar + ubah role menyusul sebagai fase sendiri.
export default async function AdminPenggunaPage() {
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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Kelola Pengguna" />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
              <h2 className="font-heading text-base font-bold text-text-primary">Kelola Pengguna</h2>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-text-secondary">
                Halaman daftar user, ubah role, dan nonaktifkan akun sedang disiapkan.
                Sementara ini pengelolaan role dilakukan via SQL Editor.
              </p>
              <Link href="/dashboard/admin" className="mt-4 inline-block text-xs font-semibold text-primary hover:text-primary-dark">
                ← Kembali ke Beranda Admin
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
