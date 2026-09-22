import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { createKosAction } from "@/app/kos/actions";
import KosForm from "../KosForm";

export default function TambahKosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Tambah Kos" />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-xl">
            <Link href="/dashboard/pemilik/kos" className="text-xs font-semibold text-primary hover:text-primary-dark">← Kembali ke daftar</Link>
            <div className="mt-3 rounded-2xl bg-surface p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-text-primary">Kos Baru</h2>
              <p className="mt-1 text-xs text-text-secondary">Setelah dibuat, tambahkan kamar, foto, dan fasilitas di halaman kelola.</p>
              <div className="mt-5">
                <KosForm action={createKosAction} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
