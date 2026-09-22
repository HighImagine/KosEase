// Query baca kos dari Supabase. Semua query publik hanya menyentuh
// kos dengan status_publikasi = 'tayang' (diperkuat juga oleh RLS).
import { createClient } from "@/lib/supabase/server";
import type { Galeri, Kamar, Kos, KosCardData, KosDetail } from "./types";

const KOS_COVER_FALLBACK = "/img/kos-placeholder.png";

export async function getTayangKosCards(): Promise<KosCardData[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("kos")
    .select("*")
    .eq("status_publikasi", "tayang")
    .order("created_at", { ascending: false });
  if (error || !rows) return [];
  const kosList = rows as Kos[];
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

  return kosList.map((kos) => {
    const km = kamar.filter((k) => k.kos_id === kos.id_kos);
    const tersedia = km.filter((k) => k.ketersediaan === "Tersedia");
    return {
      kos,
      cover: coverByKos.get(kos.id_kos) ?? KOS_COVER_FALLBACK,
      kamarTersedia: tersedia.length,
      kamarTotal: km.length,
      stokTersedia: tersedia.reduce((a, k) => a + (k.stok ?? 0), 0),
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
  const kos = (kosRows?.[0] as Kos | undefined) ?? null;
  if (!kos) return null;

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
    kamar: ((kamarRows ?? []) as Kamar[]),
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
  const kos = (kosRows?.[0] as Kos | undefined) ?? null;
  if (!kos) return null;

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
    kamar: ((kamarRows ?? []) as Kamar[]),
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
  return (data ?? []) as Kos[];
}

// Semua kos untuk moderasi admin.
// Tanpa FK constraint tidak bisa join profiles di satu query,
// jadi nama pemilik diambil lewat query kedua.
export async function getAllKosForAdmin(): Promise<(Kos & { owner_name: string | null })[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("kos").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as Kos[];
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

export type KamarMilik = {
  id: string;
  kos_id: string;
  kos_nama: string;
  nama: string;
  harga: number;
  stok: number;
  ketersediaan: string;
};

// Semua kamar milik pemilik login (untuk /dashboard/pemilik/kamar).
export async function getMyKamarList(): Promise<KamarMilik[]> {
  const mine = await getMyKosList();
  if (mine.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("kamar")
    .select("id, kos_id, nama, harga, stok, ketersediaan")
    .in("kos_id", mine.map((k) => k.id_kos))
    .order("created_at", { ascending: true });
  const rows = (data ?? []) as Omit<KamarMilik, "kos_nama">[];
  const namaByKos = new Map(mine.map((k) => [k.id_kos, k.nama]));
  return rows.map((r) => ({ ...r, kos_nama: namaByKos.get(r.kos_id) ?? "-" }));
}

export type PemilikStats = { total: number; tayang: number; draft: number; stokTersedia: number };

// Agregat ringkas untuk panel dashboard pemilik.
export async function getPemilikKosStats(): Promise<PemilikStats> {
  const mine = await getMyKosList();
  const empty = { total: 0, tayang: 0, draft: 0, stokTersedia: 0 };
  if (mine.length === 0) return empty;
  const supabase = await createClient();
  const { data } = await supabase
    .from("kamar")
    .select("kos_id, ketersediaan, stok")
    .in("kos_id", mine.map((k) => k.id_kos));
  const km = (data ?? []) as { kos_id: string; ketersediaan: string; stok: number }[];
  return {
    total: mine.length,
    tayang: mine.filter((k) => k.status_publikasi === "tayang").length,
    draft: mine.filter((k) => k.status_publikasi !== "tayang").length,
    stokTersedia: km.filter((k) => k.ketersediaan === "Tersedia").reduce((a, k) => a + (k.stok ?? 0), 0),
  };
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
