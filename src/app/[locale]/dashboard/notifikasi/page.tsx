import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarWrapper";
import { getMyNotifikasi } from "@/lib/db/queries";
import { Link } from "@/i18n/navigation";
import { markNotifikasiReadAction } from "./actions";

export default async function NotifikasiPage() {
  const notifications = await getMyNotifikasi();
  return <div className="flex min-h-screen bg-background"><DashboardSidebarUserWrapper /><div className="flex flex-1 flex-col"><DashboardNavbar title="Notifikasi" /><main className="flex-1 p-6"><div className="mx-auto max-w-2xl space-y-3">{notifications.length === 0 ? <p className="rounded-xl bg-surface p-6 text-sm text-text-secondary">Belum ada notifikasi.</p> : notifications.map((n) => <div key={n.id} className="rounded-xl bg-surface p-4 shadow-sm"><p className="font-semibold text-text-primary">{n.judul}</p><p className="mt-1 text-sm text-text-secondary">{n.isi}</p><div className="mt-3 flex gap-3 text-xs font-semibold text-primary">{n.href && <Link href={n.href}>Buka</Link>}{!n.dibaca_at && <form action={async (fd) => { await markNotifikasiReadAction(null, fd); }}><input type="hidden" name="id" value={n.id} /><button type="submit">Tandai dibaca</button></form>}</div></div>)}</div></main></div></div>;
}
