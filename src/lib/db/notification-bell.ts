// Data untuk dropdown bell notifikasi (navbar publik + dashboard).
// Badge awal hanya menghitung unread (ringan); daftar lengkap diambil lazy
// lewat server action saat dropdown pertama kali dibuka.
import {
  getMyNotifikasi,
  getPendingPengajuanCount,
  getPendingPenarikan,
  getPendingPenarikanCount,
  getRecentPendingPengajuan,
  getUnreadNotifikasiCount,
} from "./queries";

const BELL_LIMIT = 20;

export type NotificationBellMode = "user" | "admin";

export type NotificationBellSummary = {
  mode: NotificationBellMode;
  count: number;
};

export type NotificationBellItem = {
  key: string;
  title: string | null;
  body: string | null;
  href: string | null;
  unread?: boolean;
  notifId?: string;
  kind?: "pengajuan" | "penarikan";
};

export type NotificationBellGroup = {
  key: "pengajuan" | "penarikan";
  href: string;
  items: NotificationBellItem[];
};

export type NotificationBellData =
  | { mode: "user"; count: number; items: NotificationBellItem[] }
  | { mode: "admin"; count: number; groups: NotificationBellGroup[] };

// Ringkasan untuk render awal navbar: mode + jumlah badge saja.
export async function getNotificationBellSummary(
  role: string | null,
  userId?: string,
): Promise<NotificationBellSummary> {
  const norm = (role ?? "").toLowerCase();

  if (norm === "admin") {
    const [pengajuan, penarikan] = await Promise.all([
      getPendingPengajuanCount(),
      getPendingPenarikanCount(),
    ]);
    return { mode: "admin", count: pengajuan + penarikan };
  }

  return { mode: "user", count: await getUnreadNotifikasiCount(userId) };
}

// Daftar lengkap untuk dropdown (dipanggil lazy saat dropdown dibuka).
export async function getNotificationBellData(
  role: string | null,
  userId?: string,
): Promise<NotificationBellData> {
  const norm = (role ?? "").toLowerCase();

  if (norm === "admin") {
    const [pengajuan, penarikan, pengajuanCount, penarikanCount] = await Promise.all([
      getRecentPendingPengajuan(BELL_LIMIT),
      getPendingPenarikan(),
      getPendingPengajuanCount(),
      getPendingPenarikanCount(),
    ]);

    return {
      mode: "admin",
      count: pengajuanCount + penarikanCount,
      groups: [
        {
          key: "pengajuan",
          href: "/dashboard/admin/pengajuan",
          items: pengajuan.map((p) => ({
            key: `pengajuan-${p.id}`,
            title: p.nama_lengkap,
            body: null,
            href: "/dashboard/admin/pengajuan",
            unread: true,
            kind: "pengajuan",
          })),
        },
        {
          key: "penarikan",
          href: "/dashboard/admin/kos?status=penarikan",
          items: penarikan.slice(0, BELL_LIMIT).map((p) => ({
            key: `penarikan-${p.id}`,
            title: null,
            body: p.alasan,
            href: "/dashboard/admin/kos?status=penarikan",
            unread: true,
            kind: "penarikan",
          })),
        },
      ],
    };
  }

  const [items, count] = await Promise.all([
    getMyNotifikasi(BELL_LIMIT, userId),
    getUnreadNotifikasiCount(userId),
  ]);

  return {
    mode: "user",
    count,
    items: items.map((n) => ({
      key: n.id,
      title: n.judul,
      body: n.isi,
      href: n.href,
      unread: !n.dibaca_at,
      notifId: n.id,
    })),
  };
}
