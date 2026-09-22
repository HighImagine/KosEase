import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getMyKamarList } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";

export default async function KelolaKamarPage() {
  const kamarList = await getMyKamarList();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Kelola Kamar" />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-xl font-bold text-text-primary mb-1">Semua Kamar Saya</h2>
            <p className="mb-4 text-xs text-text-secondary">
              Daftar seluruh tipe kamar di semua kos Anda. Tambah/edit/hapus tetap di halaman kelola masing-masing kos.
            </p>

            {kamarList.length === 0 ? (
              <div className="rounded-xl bg-surface p-8 text-center">
                <p className="text-sm text-text-secondary">Belum ada kamar. Tambahkan lewat halaman Kelola Kos.</p>
                <Link href="/dashboard/pemilik/kos" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
                  Ke Kelola Kos
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {kamarList.map((k) => (
                  <div key={k.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {k.kos_nama} — Kamar {k.nama}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {formatHarga(k.harga)}/bln · stok {k.stok}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold text-white ${k.ketersediaan === "Tersedia" ? "bg-success" : "bg-error"}`}>
                      {k.ketersediaan}
                    </span>
                    <Link href={`/dashboard/pemilik/kos/${k.kos_id}`} className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
                      Kelola
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
