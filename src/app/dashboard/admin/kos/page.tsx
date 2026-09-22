import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getAllKosForAdmin } from "@/lib/db/queries";
import { formatHarga } from "@/lib/format";
import { DeleteKosButton, PublikasiToggle } from "@/app/dashboard/pemilik/kos/KosListActions";

export default async function AdminKosPage() {
  const kosList = await getAllKosForAdmin();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Moderasi Kos" />

        <main className="flex-1 p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Semua Kos ({kosList.length})</h2>

          {kosList.length === 0 ? (
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">Belum ada kos terdaftar.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {kosList.map((kos) => (
                <div key={kos.id_kos} className="rounded-xl bg-surface p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-base font-bold text-text-primary">{kos.nama}</h3>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {kos.lokasi} · {kos.tipe} · Pemilik: {kos.owner_name ?? "-"}
                      </p>
                      <p className="mt-1 text-sm font-bold text-primary">{formatHarga(kos.harga)}<span className="text-xs font-normal text-text-secondary"> / bulan</span></p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold text-white ${kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"}`}>
                      {kos.status_publikasi === "tayang" ? "Tayang" : "Draft"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {kos.status_publikasi === "tayang" && (
                      <Link href={`/kos/${kos.id_kos}`} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary">
                        Lihat Publik
                      </Link>
                    )}
                    <PublikasiToggle kosId={kos.id_kos} status={kos.status_publikasi} />
                    <DeleteKosButton kosId={kos.id_kos} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
