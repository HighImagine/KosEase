import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getPengajuanStatusCounts } from "@/lib/db/queries";

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
      <p className="font-heading text-xl font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}

type PengajuanRow = {
  id: string;
  nama_lengkap: string;
  no_hp: string | null;
  created_at: string;
};

async function getPendingPengajuan() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pengajuan_pemilik")
    .select("id, nama_lengkap, no_hp, created_at")
    .eq("status", "menunggu_verifikasi")
    .order("created_at", { ascending: false });
  return (data ?? []) as PengajuanRow[];
}

function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

export default async function AdminPengajuanPage() {
  const [pengajuanList, counts] = await Promise.all([
    getPendingPengajuan(),
    getPengajuanStatusCounts(),
  ]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Verifikasi Pengajuan Pemilik Kos" />

        <main className="flex-1 p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Pengajuan</h2>

          {/* Snapshot + dropdown daftar cepat (pola sama seperti Beranda admin) */}
          <div className="mb-4 grid grid-cols-3 items-start gap-3">
            <details className="rounded-xl border border-border bg-surface">
              <summary title="Klik untuk lihat daftar" className="cursor-pointer list-none px-4 py-3 text-center [&::-webkit-details-marker]:hidden">
                <p className="font-heading text-xl font-bold text-primary">{counts.menunggu}</p>
                <p className="mt-0.5 text-[10px] text-text-secondary">Menunggu ▾</p>
              </summary>
              <div className="space-y-2 border-t border-border p-3">
                {pengajuanList.length === 0 ? (
                  <p className="text-center text-[11px] text-text-secondary">Tidak ada antrean.</p>
                ) : (
                  pengajuanList.map((p) => (
                    <Link key={p.id} href={`/dashboard/admin/pengajuan/${p.id}`} className="block truncate rounded-lg bg-background px-3 py-2 text-[11px] font-semibold text-text-primary hover:text-primary">
                      {p.nama_lengkap}
                    </Link>
                  ))
                )}
              </div>
            </details>
            <StatTile value={counts.disetujui} label="Disetujui" />
            <StatTile value={counts.ditolak} label="Ditolak" />
          </div>

          {pengajuanList && pengajuanList.length > 0 ? (
            <div className="space-y-3">
              {pengajuanList.map((pengajuan) => (
                <div key={pengajuan.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{pengajuan.nama_lengkap}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{pengajuan.no_hp ?? "-"} · Diajukan {formatTanggal(pengajuan.created_at)}</p>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-warning px-3 py-1 text-[10px] font-semibold text-white sm:block">Menunggu Verifikasi</span>
                  <Link href={`/dashboard/admin/pengajuan/${pengajuan.id}`} className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
                    Detail
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-text-secondary">Tidak ada pengajuan menunggu.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
