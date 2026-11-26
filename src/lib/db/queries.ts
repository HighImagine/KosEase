// Query baca kos dari Supabase. Semua query publik hanya menyentuh
// kos dengan status_publikasi = 'tayang' (diperkuat juga oleh RLS).
import { createClient } from "@/lib/supabase/server";
import type { Galeri, Kamar, Kos, KosCardData, KosDetail, Notifikasi, PengajuanPenarikan, PengajuanPerpanjangan, Waitlist } from "./types";

const KOS_COVER_FALLBACK = "/img/kos-placeholder.png";

// Normalisasi angka Nullable dari DB agar halaman publik tidak pernah crash
// (mis. rating NULL -> .toFixed meledak). Terapkan di setiap query kos/kamar.
function normKos(row: Kos): Kos {
  return {
    ...row,
    harga: row.harga ?? 0,
    rating: row.rating ?? 0,
    ulasan: row.ulasan ?? 0,
  };
}

function normKamar(row: Kamar): Kamar {
  return {
    ...row,
    harga: row.harga ?? 0,
    stok: row.stok ?? 0,
  };
}

export async function getTayangKosCards(): Promise<KosCardData[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("kos")
    .select("*")
    .eq("status_publikasi", "tayang")
    .order("created_at", { ascending: false });
  if (error || !rows) return [];
  const kosList = (rows as Kos[]).map(normKos);
  if (kosList.length === 0) return [];
  const ids = kosList.map((k) => k.id_kos);

  const [{ data: kamarRows }, { data: galeriRows }] = await Promise.all([
    supabase.from("kamar").select("kos_id, ketersediaan, stok").in("kos_id", ids),
    supabase
      .from("galeri")
      .select("kos_id, image_url, created_at")
      .in("kos_id", ids)
      .order("created_at", { ascending: true }),
  ]);
  const kamar = (kamarRows ?? []) as Pick<Kamar, "kos_id" | "ketersediaan" | "stok">[];
  const galeri = (galeriRows ?? []) as Pick<Galeri, "kos_id" | "image_url" | "created_at">[];

  const coverByKos = new Map<string, string>();
  for (const g of galeri) {
    if (!coverByKos.has(g.kos_id) && g.image_url) coverByKos.set(g.kos_id, g.image_url);
  }

  const { data: relRows } = await supabase.from("kos_fasilitas").select("kos_id, fasilitas_id").in("kos_id", ids);
  const fasilitasMaster = await getFasilitasMaster();
  const fasilitasNameById = new Map(fasilitasMaster.map((f) => [f.id, f.nama]));
  const fasilitasByKos = new Map<string, string[]>();
  for (const r of (relRows ?? []) as { kos_id: string; fasilitas_id: string }[]) {
    const list = fasilitasByKos.get(r.kos_id) ?? [];
    const nama = fasilitasNameById.get(r.fasilitas_id);
    if (nama) list.push(nama);
    fasilitasByKos.set(r.kos_id, list);
  }

  return kosList.map((kos) => {
    const km = kamar.filter((k) => k.kos_id === kos.id_kos);
    const tersedia = km.filter((k) => k.ketersediaan === "Tersedia");
    return {
      kos,
      cover: coverByKos.get(kos.id_kos) ?? KOS_COVER_FALLBACK,
      kamarTersedia: tersedia.length,
      kamarTotal: km.length,
      stokTersedia: tersedia.reduce((a, k) => a + (k.stok ?? 0), 0),
      fasilitas: fasilitasByKos.get(kos.id_kos) ?? [],
    };
  });
}

// Detail publik: hanya kos tayang. Kembalikan null jika tidak ada / masih draft.
export async function getPublicKosDetail(idKos: string): Promise<KosDetail | null> {
  const supabase = await createClient();
  const { data: kosRows } = await supabase
    .from("kos")
    .select("*")
    .eq("id_kos", idKos)
    .eq("status_publikasi", "tayang")
    .limit(1);
  const kosRaw = (kosRows?.[0] as Kos | undefined) ?? null;
  if (!kosRaw) return null;
  const kos = normKos(kosRaw);

  const [{ data: kamarRows }, { data: galeriRows }, { data: relRows }] = await Promise.all([
    supabase.from("kamar").select("*").eq("kos_id", idKos).order("harga", { ascending: true }),
    supabase.from("galeri").select("*").eq("kos_id", idKos).order("created_at", { ascending: true }),
    supabase.from("kos_fasilitas").select("fasilitas_id").eq("kos_id", idKos),
  ]);
  const rel = (relRows ?? []) as { fasilitas_id: string }[];
  let fasilitas: string[] = [];
  if (rel.length > 0) {
    const { data: fasRows } = await supabase
      .from("fasilitas")
      .select("id, nama")
      .in("id", rel.map((r) => r.fasilitas_id));
    fasilitas = ((fasRows ?? []) as { nama: string }[]).map((f) => f.nama);
  }

  return {
    kos,
    kamar: ((kamarRows ?? []) as Kamar[]).map(normKamar),
    galeri: ((galeriRows ?? []) as Galeri[]),
    fasilitas,
  };
}

// Detail untuk pemilik/admin: boleh draft, tapi wajib pemilik kos atau admin.
// Kembalikan null jika tidak berhak.
export async function getOwnedKosDetail(idKos: string): Promise<KosDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: kosRows } = await supabase.from("kos").select("*").eq("id_kos", idKos).limit(1);
  const kosRaw = (kosRows?.[0] as Kos | undefined) ?? null;
  if (!kosRaw) return null;
  const kos = normKos(kosRaw);

  let role: string | null = null;
  try {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
    role = ((data?.[0] as { role?: string } | undefined)?.role ?? null)?.toLowerCase() ?? null;
  } catch {}
  if (role !== "admin" && kos.id_pemilik !== user.id) return null;

  const [{ data: kamarRows }, { data: galeriRows }, { data: relRows }] = await Promise.all([
    supabase.from("kamar").select("*").eq("kos_id", idKos).order("created_at", { ascending: true }),
    supabase.from("galeri").select("*").eq("kos_id", idKos).order("created_at", { ascending: true }),
    supabase.from("kos_fasilitas").select("fasilitas_id").eq("kos_id", idKos),
  ]);
  const rel = (relRows ?? []) as { fasilitas_id: string }[];
  let fasilitas: string[] = [];
  if (rel.length > 0) {
    const { data: fasRows } = await supabase
      .from("fasilitas")
      .select("id, nama")
      .in("id", rel.map((r) => r.fasilitas_id));
    fasilitas = ((fasRows ?? []) as { nama: string }[]).map((f) => f.nama);
  }

  return {
    kos,
    kamar: ((kamarRows ?? []) as Kamar[]).map(normKamar),
    galeri: ((galeriRows ?? []) as Galeri[]),
    fasilitas,
  };
}

// Daftar kos milik pemilik yang sedang login (untuk /dashboard/pemilik/kos).
export async function getMyKosList(): Promise<Kos[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("kos")
    .select("*")
    .eq("id_pemilik", user.id)
    .order("created_at", { ascending: false });
  return ((data ?? []) as Kos[]).map(normKos);
}

// Semua kos untuk moderasi admin.
// Tanpa FK constraint tidak bisa join profiles di satu query,
// jadi nama pemilik diambil lewat query kedua.
export async function getAllKosForAdmin(): Promise<(Kos & { owner_name: string | null })[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("kos").select("*").order("created_at", { ascending: false });
  const rows = ((data ?? []) as Kos[]).map(normKos);
  if (rows.length === 0) return [];
  const ownerIds = [...new Set(rows.map((r) => r.id_pemilik))];
  const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
  const nameById = new Map(((profs ?? []) as { id: string; full_name: string }[]).map((p) => [p.id, p.full_name]));
  return rows.map((r) => ({ ...r, owner_name: nameById.get(r.id_pemilik) ?? null }));
}

// Master fasilitas untuk picker di form.
export async function getFasilitasMaster(): Promise<{ id: string; nama: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("fasilitas").select("id, nama").order("nama", { ascending: true });
  return (data ?? []) as { id: string; nama: string }[];
}

export type KamarMilik = Kamar & {
  kos_nama: string;
  kos_lokasi: string;
  kos_tipe: Kos["tipe"];
  kos_status: Kos["status_publikasi"];
};

export type KamarBoard = { kos: Kos[]; kamar: KamarMilik[] };

// Kos + seluruh kamar milik pemilik login (untuk /dashboard/pemilik/kamar).
// Cukup dua query: daftar kos, lalu semua kamar dari kos tersebut.
export async function getMyKamarBoard(): Promise<KamarBoard> {
  const kos = await getMyKosList();
  if (kos.length === 0) return { kos, kamar: [] };
  const supabase = await createClient();
  const { data } = await supabase
    .from("kamar")
    .select("*")
    .in("kos_id", kos.map((k) => k.id_kos))
    .order("created_at", { ascending: true });
  const kosById = new Map(kos.map((k) => [k.id_kos, k]));
  const kamar = ((data ?? []) as Kamar[]).map(normKamar).map((row) => {
    const parent = kosById.get(row.kos_id);
    return {
      ...row,
      kos_nama: parent?.nama ?? "-",
      kos_lokasi: parent?.lokasi ?? "-",
      kos_tipe: parent?.tipe ?? "Campur",
      kos_status: parent?.status_publikasi ?? "draft",
    } satisfies KamarMilik;
  });
  return { kos, kamar };
}

export type PemilikKosRingkas = {
  kos: Kos;
  cover: string | null;
  totalStok: number;
  sisaStok: number;
  kamarTipe: number;
  adaFoto: boolean;
};

export type PemilikDashboardStats = {
  total: number;
  tayang: number;
  draft: number;
  stokTersedia: number;
  totalStok: number;
  kamarTipe: number;
};

export type PemilikDashboardData = {
  stats: PemilikDashboardStats;
  ringkas: PemilikKosRingkas[];
  masuk: PemesananTampil[];
  perpanjangan: PengajuanPerpanjangan[];
  penarikan: PengajuanPenarikan[];
};

// Seluruh data Beranda pemilik dalam tiga gelombang query:
// kos -> (kamar | galeri | pemesanan | penarikan) -> perpanjangan.
// Nama kos/kamar dilengkapi dari data yang sudah diambil sehingga tidak
// memanggil getMyKosList/withNamaKosKamar lagi.
export async function getPemilikDashboardData(): Promise<PemilikDashboardData> {
  const kos = await getMyKosList();
  if (kos.length === 0) {
    return {
      stats: { total: 0, tayang: 0, draft: 0, stokTersedia: 0, totalStok: 0, kamarTipe: 0 },
      ringkas: [],
      masuk: [],
      perpanjangan: [],
      penarikan: [],
    };
  }

  const supabase = await createClient();
  const ids = kos.map((k) => k.id_kos);

  const [{ data: kamarRows }, { data: galeriRows }, { data: pemesananRows }, { data: penarikanRows }] =
    await Promise.all([
      supabase.from("kamar").select("id, kos_id, nama, harga, stok, ketersediaan").in("kos_id", ids),
      supabase
        .from("galeri")
        .select("kos_id, image_url, created_at")
        .in("kos_id", ids)
        .order("created_at", { ascending: true }),
      supabase
        .from("pemesanan")
        .select("*")
        .in("kos_id", ids)
        .order("created_at", { ascending: false }),
      supabase
        .from("pengajuan_penarikan")
        .select("*")
        .eq("status", "menunggu")
        .order("created_at", { ascending: false }),
    ]);

  const kamar = (kamarRows ?? []) as Pick<
    Kamar,
    "id" | "kos_id" | "nama" | "harga" | "stok" | "ketersediaan"
  >[];
  const galeri = (galeriRows ?? []) as Pick<Galeri, "kos_id" | "image_url" | "created_at">[];
  const pemesanan = (pemesananRows ?? []) as Pemesanan[];

  const coverByKos = new Map<string, string>();
  for (const g of galeri) {
    if (g.image_url && !coverByKos.has(g.kos_id)) coverByKos.set(g.kos_id, g.image_url);
  }

  const ringkas: PemilikKosRingkas[] = kos.map((k) => {
    const km = kamar.filter((r) => r.kos_id === k.id_kos);
    return {
      kos: k,
      cover: coverByKos.get(k.id_kos) ?? null,
      totalStok: km.reduce((a, r) => a + (r.stok ?? 0), 0),
      sisaStok: km.filter((r) => r.ketersediaan === "Tersedia").reduce((a, r) => a + (r.stok ?? 0), 0),
      kamarTipe: km.length,
      adaFoto: coverByKos.has(k.id_kos),
    };
  });

  const stats: PemilikDashboardStats = {
    total: kos.length,
    tayang: kos.filter((k) => k.status_publikasi === "tayang").length,
    draft: kos.filter((k) => k.status_publikasi !== "tayang").length,
    stokTersedia: ringkas.reduce((a, r) => a + r.sisaStok, 0),
    totalStok: ringkas.reduce((a, r) => a + r.totalStok, 0),
    kamarTipe: ringkas.reduce((a, r) => a + r.kamarTipe, 0),
  };

  const kosNamaById = new Map(kos.map((k) => [k.id_kos, k.nama]));
  const kamarById = new Map(kamar.map((r) => [r.id, r]));
  const masuk: PemesananTampil[] = pemesanan.map((p) => {
    const km = kamarById.get(p.kamar_id);
    return {
      ...p,
      kos_nama: kosNamaById.get(p.kos_id) ?? "-",
      kamar_nama: km?.nama ?? "-",
      kamar_harga: km?.harga ?? 0,
      kamar_stok: km?.stok ?? 0,
    };
  });

  let perpanjangan: PengajuanPerpanjangan[] = [];
  const pemesananIds = pemesanan.map((p) => p.id);
  if (pemesananIds.length > 0) {
    const { data } = await supabase
      .from("pengajuan_perpanjangan")
      .select("*")
      .in("pemesanan_id", pemesananIds)
      .eq("status", "menunggu")
      .order("created_at", { ascending: false });
    perpanjangan = (data ?? []) as PengajuanPerpanjangan[];
  }

  return {
    stats,
    ringkas,
    masuk,
    perpanjangan,
    penarikan: (penarikanRows ?? []) as PengajuanPenarikan[],
  };
}

// Hitungan ringan pesanan yang menunggu konfirmasi (badge sidebar pemilik).
export async function getPendingReservasiCount(): Promise<number> {
  const mine = await getMyKosList();
  if (mine.length === 0) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("pemesanan")
    .select("id", { count: "exact", head: true })
    .in("kos_id", mine.map((k) => k.id_kos))
    .eq("status", "menunggu");
  return count ?? 0;
}

export type PendingPengajuanItem = {
  id: string;
  nama_lengkap: string;
  no_hp: string | null;
  created_at: string;
};

// Antrean pengajuan terbaru untuk preview Beranda admin.
export async function getRecentPendingPengajuan(limit = 3): Promise<PendingPengajuanItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pengajuan_pemilik")
    .select("id, nama_lengkap, no_hp, created_at")
    .eq("status", "menunggu_verifikasi")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as PendingPengajuanItem[];
}

// Hitungan ringan pengajuan pemilik yang masih menunggu (badge notifikasi admin).
export async function getPendingPengajuanCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("pengajuan_pemilik")
    .select("id", { count: "exact", head: true })
    .eq("status", "menunggu_verifikasi");
  return count ?? 0;
}

export type UserRoleCounts = { total: number; penyewa: number; pemilik: number; admin: number };

// Hitungan user per role untuk preview Kelola Pengguna.
// Butuh RLS profiles yang mengizinkan admin membaca semua baris.
export async function getUserRoleCounts(): Promise<UserRoleCounts> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("role");
  const rows = (data ?? []) as { role: string | null }[];
  let penyewa = 0;
  let pemilik = 0;
  let admin = 0;
  for (const r of rows) {
    const norm = (r.role ?? "").toLowerCase();
    if (norm === "admin") admin += 1;
    else if (norm === "pemilik" || norm === "pemilik_kos") pemilik += 1;
    else penyewa += 1;
  }
  return { total: rows.length, penyewa, pemilik, admin };
}

export type PengajuanStatusCounts = { menunggu: number; disetujui: number; ditolak: number; total: number };

// Hitungan pengajuan per status untuk snapshot halaman verifikasi.
export async function getPengajuanStatusCounts(): Promise<PengajuanStatusCounts> {
  const supabase = await createClient();
  const [menunggu, disetujui, ditolak] = await Promise.all(
    (["menunggu_verifikasi", "disetujui", "ditolak"] as const).map(
      async (s) => {
        const { count } = await supabase
          .from("pengajuan_pemilik")
          .select("id", { count: "exact", head: true })
          .eq("status", s);
        return count ?? 0;
      }
    )
  );
  return { menunggu, disetujui, ditolak, total: menunggu + disetujui + ditolak };
}

export type PengajuanDetail = {
  id: string;
  user_id: string;
  nama_lengkap: string;
  no_hp: string | null;
  alamat: string | null;
  alasan: string | null;
  info_kos: string | null;
  status: string;
  diverifikasi_oleh: string | null;
  diverifikasi_at: string | null;
  alasan_tolak: string | null;
  dokumen_url: string | null;
  created_at: string;
};

// Satu pengajuan by id (untuk halaman detail admin).
export async function getPengajuanDetail(id: string): Promise<PengajuanDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("pengajuan_pemilik").select("*").eq("id", id).limit(1);
  return (data?.[0] as PengajuanDetail | undefined) ?? null;
}

export type KosOwner = { nama: string | null; avatar_url: string | null };

// Pemilik kos untuk kartu "Dikelola oleh" (nama + avatar saja, tanpa kontak).
// Null bila tak terbaca — pemanggil wajib tampilkan fallback generik.
export async function getKosOwner(idPemilik: string): Promise<KosOwner | null> {
  if (!idPemilik) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", idPemilik)
    .limit(1);
  const row = data?.[0] as { full_name?: string | null; avatar_url?: string | null } | undefined;
  if (!row) return null;
  return { nama: row.full_name ?? null, avatar_url: row.avatar_url ?? null };
}

export type StatusPemesanan = "menunggu" | "dikonfirmasi" | "ditolak" | "dibatalkan";

export type Pemesanan = {
  id: string;
  user_id: string;
  kos_id: string;
  kamar_id: string;
  nama_pemesan: string;
  no_wa: string;
  tanggal_mulai: string; // date
  durasi: number; // bulan
  total_harga: number;
  catatan: string | null;
  status: StatusPemesanan;
  waitlist_id?: string | null;
  created_at: string;
};

export type PemesananTampil = Pemesanan & {
  kos_nama: string;
  kamar_nama: string;
  kamar_harga: number;
  kamar_stok: number; // sisa stok kamar pada saat pesanan dibuat (source of truth: stok)
};

async function withNamaKosKamar(rows: Pemesanan[]): Promise<PemesananTampil[]> {
  if (rows.length === 0) return [];
  const supabase = await createClient();
  const kosIds = [...new Set(rows.map((r) => r.kos_id))];
  const kamarIds = [...new Set(rows.map((r) => r.kamar_id))];
  const [{ data: kosRows }, { data: kamarRows }] = await Promise.all([
    supabase.from("kos").select("id_kos, nama").in("id_kos", kosIds),
    supabase.from("kamar").select("id, nama, harga, stok").in("id", kamarIds),
  ]);
  const kosById = new Map(((kosRows ?? []) as { id_kos: string; nama: string }[]).map((k) => [k.id_kos, k.nama]));
  const kamarById = new Map(
    ((kamarRows ?? []) as { id: string; nama: string; harga: number; stok: number }[]).map((k) => [
      k.id,
      { nama: k.nama, harga: k.harga ?? 0, stok: k.stok ?? 0 },
    ])
  );
  return rows.map((r) => ({
    ...r,
    kos_nama: kosById.get(r.kos_id) ?? "-",
    kamar_nama: kamarById.get(r.kamar_id)?.nama ?? "-",
    kamar_harga: kamarById.get(r.kamar_id)?.harga ?? 0,
    kamar_stok: kamarById.get(r.kamar_id)?.stok ?? 0,
  }));
}

// Pesanan milik user login (untuk /dashboard/reservasi).
export async function getMyPemesanan(): Promise<PemesananTampil[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("pemesanan")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return withNamaKosKamar((data ?? []) as Pemesanan[]);
}

// Pesanan masuk ke kos milik pemilik login (untuk Reservasi Masuk).
export async function getMasukReservasi(): Promise<PemesananTampil[]> {
  const mine = await getMyKosList();
  if (mine.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("pemesanan")
    .select("*")
    .in("kos_id", mine.map((k) => k.id_kos))
    .order("created_at", { ascending: false });
  return withNamaKosKamar((data ?? []) as Pemesanan[]);
}

// Antrian waitlist milik kos tertentu (dipakai pemilik + admin untuk moderasi).
export async function getWaitlistByKos(kosId: string): Promise<Waitlist[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .eq("kos_id", kosId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as Waitlist[];
}

// Antrian waitlist milik user login (untuk halaman "antrian saya").
export async function getMyWaitlist(): Promise<Waitlist[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("waitlist")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  return (data ?? []) as Waitlist[];
}

export async function getMyNotifikasi(limit?: number, userId?: string): Promise<Notifikasi[]> {
  const supabase = await createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    uid = user?.id;
  }
  if (!uid) return [];
  let query = supabase.from("notifikasi").select("*").eq("user_id", uid).order("created_at", { ascending: false });
  if (limit && limit > 0) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as Notifikasi[];
}

export async function getUnreadNotifikasiCount(userId?: string): Promise<number> {
  const supabase = await createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    uid = user?.id;
  }
  if (!uid) return 0;
  const { count } = await supabase.from("notifikasi").select("id", { count: "exact", head: true }).eq("user_id", uid).is("dibaca_at", null);
  return count ?? 0;
}

export async function getMyPengajuanPerpanjangan(): Promise<PengajuanPerpanjangan[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("pengajuan_perpanjangan").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return (data ?? []) as PengajuanPerpanjangan[];
}

export async function getMasukPerpanjangan(): Promise<PengajuanPerpanjangan[]> {
  const mine = await getMyKosList();
  if (!mine.length) return [];
  const supabase = await createClient();
  const { data: bookingRows } = await supabase.from("pemesanan").select("id").in("kos_id", mine.map((k) => k.id_kos));
  const ids = (bookingRows ?? []).map((row) => String(row.id));
  if (!ids.length) return [];
  const { data } = await supabase.from("pengajuan_perpanjangan").select("*").in("pemesanan_id", ids).order("created_at", { ascending: false });
  return (data ?? []) as PengajuanPerpanjangan[];
}

// Pengajuan penarikan yang masih menunggu persetujuan admin.
// RLS membatasi: pemilik hanya melihat miliknya, admin melihat semua.
// Tabel bisa belum ada di lingkungan lama -> kembalikan [] agar halaman aman.
export async function getPendingPenarikan(): Promise<PengajuanPenarikan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pengajuan_penarikan")
    .select("*")
    .eq("status", "menunggu")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as PengajuanPenarikan[];
}

// Hitungan ringan penarikan yang menunggu (badge notifikasi admin).
export async function getPendingPenarikanCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("pengajuan_penarikan")
    .select("id", { count: "exact", head: true })
    .eq("status", "menunggu");
  if (error) return 0;
  return count ?? 0;
}

export type AdminStats = { total: number; tayang: number; draft: number; pengajuanPending: number };

// Agregat ringkas untuk panel dashboard admin.
export async function getAdminKosStats(): Promise<AdminStats> {
  const all = await getAllKosForAdmin();
  const supabase = await createClient();
  const { count } = await supabase
    .from("pengajuan_pemilik")
    .select("id", { count: "exact", head: true })
    .eq("status", "menunggu_verifikasi");
  return {
    total: all.length,
    tayang: all.filter((k) => k.status_publikasi === "tayang").length,
    draft: all.filter((k) => k.status_publikasi !== "tayang").length,
    pengajuanPending: count ?? 0,
  };
}

export type AdminDashboardData = {
  stats: AdminStats;
  allKos: (Kos & { owner_name: string | null })[];
  pending: PendingPengajuanItem[];
  penarikan: PengajuanPenarikan[];
};

// Gabungan data untuk Beranda admin: agregat stat + daftar kos + antrean
// pengajuan pending dalam satu respons, tanpa query ganda ke tabel kos.
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const allKos = await getAllKosForAdmin();
  const supabase = await createClient();
  const { count } = await supabase
    .from("pengajuan_pemilik")
    .select("id", { count: "exact", head: true })
    .eq("status", "menunggu_verifikasi");
  const [pending, penarikan] = await Promise.all([getRecentPendingPengajuan(3), getPendingPenarikan()]);
  return {
    stats: {
      total: allKos.length,
      tayang: allKos.filter((k) => k.status_publikasi === "tayang").length,
      draft: allKos.filter((k) => k.status_publikasi !== "tayang").length,
      pengajuanPending: count ?? 0,
    },
    allKos,
    pending,
    penarikan,
  };
}
