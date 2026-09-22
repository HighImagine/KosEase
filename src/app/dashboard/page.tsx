import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import PengajuanCard from "@/components/PengajuanCard";
import ActiveBookingCard from "@/components/ActiveBookingCard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let displayName: string | null = null;
    let avatarUrl: string | null = null;
    let email: string | null = null;
    let roleLabel = "Penyewa";
    if (user) {
        email = user.email ?? null;
        displayName = (user.user_metadata?.full_name as string)?.split(" ")[0] ?? "Penyewa";
        avatarUrl = (user.user_metadata?.avatar_url as string) ?? null;
        try {
            const { data } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", user.id).single();
            if (data) {
                displayName = (data.full_name as string) ?? displayName;
                avatarUrl = (data.avatar_url as string) ?? avatarUrl;
                const r = (data.role as string)?.toLowerCase();
                if (r === "pemilik" || r === "pemilik_kos") roleLabel = "Pemilik Kos";
                else if (r === "admin") roleLabel = "Admin";
                else roleLabel = "Penyewa";
            }
        } catch {}
    }

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUserWrapper />

            <div className="flex flex-1 flex-col">
                <DashboardNavbar title="Dashboard" />

                <main className="flex-1 p-6">
                    <div className="grid gap-4 lg:grid-cols-3">

                        {/* Profil */}
                        <div className="lg:col-span-2 rounded-xl bg-surface p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="font-heading text-base font-bold text-text-primary">Profil Saya</h2>
                                <Link href="/dashboard/profil" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">Edit Profil</Link>
                            </div>
                            <div className="mt-4">
                                <p className="font-body text-xs text-text-secondary">Nama Lengkap</p>
                                <p className="mt-0.5 font-body text-sm font-semibold text-text-primary">{displayName ?? "-"}</p>
                                <p className="mt-3 font-body text-xs text-text-secondary">Alamat Email</p>
                                <p className="mt-0.5 font-body text-sm font-semibold text-text-primary">{email ?? "-"}</p>
                                <p className="mt-3 font-body text-xs text-text-secondary">Nomor Telepon</p>
                                <p className="mt-0.5 font-body text-sm font-semibold text-text-primary">{(user?.user_metadata?.phone as string) ?? "-"}</p>
                            </div>
                        </div>

                        {/* Pengajuan Pemilik */}
                        <PengajuanCard status="belum_mengajukan" />

                    </div>

                    {/* Reservasi Aktif */}
                    <div className="mt-6 rounded-xl bg-surface overflow-hidden">
                        <ActiveBookingCard
                            gambar="/img/kos-placeholder.png"
                            namaKos="Kos Putri Sakinah"
                            kamarNama="Kamar A3"
                            kamarDetail="3x4m • Kamar Mandi Dalam"
                            tanggalMasuk="1 Februari 2026"
                            harga={1200000}
                            status="Menunggu"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}