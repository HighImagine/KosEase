import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUser from "@/components/DashboardSidebarUser";
import PengajuanCard from "@/components/PengajuanCard";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUser />

            <div className="flex flex-1 flex-col">
                <DashboardNavbar
                    title="Dashboard"
                    userName="Ahmad Syafi'i"
                    userRole="Pengguna"
                    userImage="/img/user.jpg"
                />

                <main className="flex-1 p-6">
                    <div className="grid gap-4 lg:grid-cols-3">

                        {/* Profil */}
                        <div className="lg:col-span-2 rounded-xl bg-surface p-5">
                            <h2 className="font-heading text-base font-bold text-text-primary">
                                Profil Saya
                            </h2>

                            <div className="mt-4">
                                <p className="font-body text-xs text-text-secondary">
                                    Nama Lengkap
                                </p>
                                <p className="mt-1 font-body text-sm font-semibold text-text-primary">
                                    Ahmad Syafi'i
                                </p>

                                <p className="mt-3 font-body text-xs text-text-secondary">
                                    Alamat Email
                                </p>
                                <p className="mt-1 font-body text-sm font-semibold text-text-primary">
                                    ahmad.syafii@mahasiswa.ac.id
                                </p>

                                <p className="mt-3 font-body text-xs text-text-secondary">
                                    No. Telepon
                                </p>
                                <p className="mt-1 font-body text-sm font-semibold text-text-primary">
                                    +62 856-1234-5678
                                </p>
                            </div>
                        </div>

                        {/* Pengajuan Pemilik */}
                        <PengajuanCard status="belum_mengajukan" />

                    </div>
                </main>
            </div>
        </div>
    );
}