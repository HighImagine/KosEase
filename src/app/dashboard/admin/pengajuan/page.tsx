import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { approvePengajuanAction, rejectPengajuanAction } from "@/app/(auth)/actions";

async function getPendingPengajuan() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pengajuan_pemilik_kos")
    .select("*, profiles(full_name), users(email)")
    .eq("status", "menunggu_verifikasi")
    .order("created_at", { ascending: false });
  return data;
}

export default async function AdminPengajuanPage() {
  const pengajuanList = await getPendingPengajuan();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title="Verifikasi Pengajuan Pemilik Kos" />

        <main className="flex-1 p-6">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Pengajuan Pending</h2>

          {pengajuanList && pengajuanList.length > 0 ? (
            <div className="space-y-4">
              {pengajuanList.map((pengajuan) => (
                <form key={pengajuan.id} className="rounded-xl border border-border bg-surface p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">{pengajuan.profiles?.full_name ?? pengajuan.users?.email ?? "Nama tidak diketahui"}</p>
                      <p className="text-xs text-text-secondary">{pengajuan.users?.email}</p>
                    </div>
                    <span className="rounded-full bg-warning px-3 py-1 text-[10px] font-semibold text-white">Menunggu Verifikasi</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-semibold text-text-secondary">Nama</p>
                      <p className="text-sm text-text-primary">{pengajuan.nama}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-secondary">Nomor WhatsApp</p>
                      <p className="text-sm text-text-primary">{pengajuan.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-secondary">Alamat</p>
                      <p className="text-sm text-text-primary">{pengajuan.alamat}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-text-secondary">Alasan</p>
                      <p className="text-sm text-text-primary">{pengajuan.alasan}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-text-secondary">Informasi Kos</p>
                    <p className="text-sm text-text-primary">{pengajuan.info_kos}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <form action={approvePengajuanAction as any} className="inline">
                      <input type="hidden" name="pengajuanId" value={pengajuan.id} />
                      <button type="submit" className="rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-600">Approve</button>
                    </form>
                    <form action={rejectPengajuanAction as any} className="inline">
                      <input type="hidden" name="pengajuanId" value={pengajuan.id} />
                      <input type="hidden" name="alasanTolak" value="Ditolak oleh admin" />
                      <button type="submit" className="rounded-lg bg-error px-4 py-2 text-xs font-semibold text-white hover:bg-red-600">Reject</button>
                    </form>
                  </div>
                </form>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-text-secondary">Tidak ada pengajuan pending.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
