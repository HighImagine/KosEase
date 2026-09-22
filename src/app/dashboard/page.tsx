import Link from "next/link";
import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import PengajuanCard from "@/components/PengajuanCard";
import ActiveBookingCard from "@/components/ActiveBookingCard";
import { createClient } from "@/lib/supabase/server";
import { getAdminKosStats, getPemilikKosStats, getTayangKosCards } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";

function StatTile({ value, label }: { value: number; label: string }) {
    return (
        <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
            <p className="font-heading text-xl font-bold text-primary">{value}</p>
            <p className="mt-0.5 text-[10px] text-text-secondary">{label}</p>
        </div>
    );
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let roleLabel = "Penyewa";
    let pengajuanStatus: "belum_mengajukan" | "menunggu" | "disetujui" | "ditolak" = "belum_mengajukan";
    if (user) {
        try {
            const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
            const r = (data?.role as string | undefined)?.toLowerCase();
            if (r === "pemilik" || r === "pemilik_kos") roleLabel = "Pemilik Kos";
            else if (r === "admin") roleLabel = "Admin";
            else roleLabel = "Penyewa";
        } catch {}
        // Status pengajuan hanya relevan untuk penyewa; default belum_mengajukan.
        if (roleLabel === "Penyewa") {
            try {
                const { data } = await supabase
                    .from("pengajuan_pemilik")
                    .select("status")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1);
                const s = (data?.[0] as { status?: string } | undefined)?.status;
                if (s === "menunggu_verifikasi") pengajuanStatus = "menunggu";
                else if (s === "disetujui") pengajuanStatus = "disetujui";
                else if (s === "ditolak") pengajuanStatus = "ditolak";
            } catch {}
        }
    }
    const showPengajuanCard = roleLabel !== "Pemilik Kos" && roleLabel !== "Admin";
    const isPemilik = roleLabel === "Pemilik Kos";
    const isAdmin = roleLabel === "Admin";
    // Data ringkasan sesuai peran — masing-masing satu query agregat.
    const pemilikStats = isPemilik ? await getPemilikKosStats() : null;
    const adminStats = isAdmin ? await getAdminKosStats() : null;
    const kosTerbaru = !isPemilik && !isAdmin ? (await getTayangKosCards()).slice(0, 3) : [];

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUserWrapper />

            <div className="flex flex-1 flex-col">
                <DashboardNavbar title="Dashboard" />

                <main className="flex-1 p-6">
                    <div className="grid gap-4 lg:grid-cols-3">

                        {/* Ringkasan peran — ganti card Profil Saya yang redundan */}
                        <div className={`${showPengajuanCard ? "lg:col-span-2" : "lg:col-span-3"} rounded-xl bg-surface p-5`}>
                            {isPemilik && pemilikStats && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-heading text-base font-bold text-text-primary">Ringkasan Kos Saya</h2>
                                        <Link href="/dashboard/pemilik/kos" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">Kelola Kos</Link>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <StatTile value={pemilikStats.total} label="Total Kos" />
                                        <StatTile value={pemilikStats.tayang} label="Tayang" />
                                        <StatTile value={pemilikStats.draft} label="Draft" />
                                        <StatTile value={pemilikStats.stokTersedia} label="Kamar Tersedia" />
                                    </div>
                                </>
                            )}

                            {isAdmin && adminStats && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-heading text-base font-bold text-text-primary">Ringkasan Platform</h2>
                                        <div className="flex gap-2">
                                            <Link href="/dashboard/admin/kos" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">Moderasi Kos</Link>
                                            <Link href="/dashboard/admin/pengajuan" className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary">Pengajuan</Link>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <StatTile value={adminStats.total} label="Total Kos" />
                                        <StatTile value={adminStats.tayang} label="Tayang" />
                                        <StatTile value={adminStats.draft} label="Draft" />
                                        <StatTile value={adminStats.pengajuanPending} label="Pengajuan Pending" />
                                    </div>
                                </>
                            )}

                            {!isPemilik && !isAdmin && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-heading text-base font-bold text-text-primary">Kos Terbaru</h2>
                                        <Link href="/cari-kos" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">Cari Kos</Link>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {kosTerbaru.length === 0 ? (
                                            <p className="text-xs text-text-secondary">Belum ada kos tayang saat ini.</p>
                                        ) : (
                                            kosTerbaru.map(({ kos, cover }) => (
                                                <Link key={kos.id_kos} href={`/kos/${kos.id_kos}`} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                                                        <Image src={cover ?? "/img/kos-placeholder.png"} alt={kos.nama} fill sizes="48px" className="object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-text-primary">{kos.nama}</p>
                                                        <p className="mt-0.5 truncate text-[10px] text-text-secondary">{kos.lokasi} · {formatHarga(kos.harga)}/bln</p>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Pengajuan Pemilik — disembunyikan untuk pemilik/admin */}
                        {showPengajuanCard && <PengajuanCard status={pengajuanStatus} />}

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