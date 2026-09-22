import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import PengajuanForm from "./PengajuanForm";

export default function PengajuanPemilik() {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebarUserWrapper />

            <div className="flex flex-1 flex-col">
<DashboardNavbar title="Ajukan Diri sebagai Pemilik Kos" />

                <main className="flex-1 p-6">
                    <div className="rounded-xl border border-primary-light bg-primary-light p-5">
                        <div className="flex gap-4">
                            <Image src="/img/favicon.png" alt="" width={32} height={32} />
                            <div>
                                <h2 className="text-sm font-bold text-primary">Langkah Mudah Menjadi Pemilik Kos</h2>
                                <p className="mt-1 text-xs leading-relaxed text-text-secondary">Ingin mendaftarkan kos Anda di KosEase? Isi formulir di bawah ini untuk mengajukan diri sebagai Pemilik Kos!</p>
                            </div>
                        </div>
                    </div>

                    <PengajuanForm />
                </main>
            </div>
        </div>
    )
}
