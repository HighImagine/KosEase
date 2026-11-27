// Tipe baris database (schema public, tanpa FK constraint).
// Cerminkan 1:1 dengan kolom + tipe di Supabase. Jangan menambah kolom di sini
// tanpa migrasi SQL terlebih dahulu.

export type TipeKos = "Campur" | "Laki-laki" | "Perempuan";
export type StatusPublikasi = "draft" | "tayang";
export type Ketersediaan = "Tersedia" | "Penuh";
export type StatusPenarikan = "menunggu" | "disetujui" | "ditolak";

// Aturan kos (checkbox di dashboard pemilik). Daftar lengkap + label/icon
// ada di src/lib/aturan.ts. Key disimpan sebagai text[] di kolom kos.aturan.
export type AturanKos =
  | "belum_menikah"
  | "pasutri"
  | "boleh_anak"
  | "bawa_tamu"
  | "tamu_menginap"
  | "merokok"
  | "dilarang_merokok"
  | "boleh_hewan"
  | "dilarang_hewan"
  | "akses_24_jam"
  | "jam_malam_tamu";

// Antrian waitlist penyewaan kos (dipakai saat kos/kamar penuh).
export type StatusWaitlist = "menunggu" | "ditawarkan" | "diklaim" | "selesai" | "dibatalkan" | "kedaluwarsa";

export type Waitlist = {
  id: string; // uuid
  user_id: string; // uuid -> auth.users.id
  kos_id: string; // uuid -> kos.id_kos (tanpa FK)
  kamar_id: string; // uuid -> kamar.id (tanpa FK)
  nama: string;
  no_wa: string;
  tanggal_mulai: string; // date
  durasi: number; // bulan
  catatan: string | null;
  status: StatusWaitlist;
  slot_mulai: string | null;
  ditawarkan_at: string | null;
  berlaku_sampai: string | null;
  pemesanan_id: string | null;
  created_at: string; // timestamptz
};

export type Notifikasi = {
  id: string;
  user_id: string;
  jenis: "waitlist" | "perpanjangan" | "pemesanan" | "sistem";
  judul: string;
  isi: string;
  href: string | null;
  dibaca_at: string | null;
  created_at: string;
};

export type PengajuanPerpanjangan = {
  id: string;
  pemesanan_id: string;
  user_id: string;
  tambahan_bulan: number;
  status: "menunggu" | "disetujui" | "ditolak";
  diproses_oleh: string | null;
  diproses_at: string | null;
  alasan_tolak: string | null;
  created_at: string;
};

// Pengajuan penarikan kos oleh pemilik (menunggu persetujuan admin).
export type PengajuanPenarikan = {
  id: string; // uuid
  kos_id: string; // uuid -> kos.id_kos (tanpa FK)
  id_pemilik: string; // uuid -> profiles.id (tanpa FK)
  alasan: string;
  status: StatusPenarikan;
  diproses_oleh: string | null; // uuid admin
  diproses_at: string | null; // timestamptz
  created_at: string; // timestamptz
};

export type Kos = {
  id_kos: string; // uuid
  id_pemilik: string; // uuid -> profiles.id (tanpa FK, dicek di kode + RLS)
  nama: string;
  tipe: TipeKos;
  lokasi: string;
  alamat: string;
  harga: number; // integer, harga termurah (auto-update dari kamar)
  status_publikasi: StatusPublikasi;
  deskripsi: string | null;
  rating: number; // numeric(2,1), default 0 (dihitung saat fitur ulasan ada)
  ulasan: number; // integer, jumlah ulasan
  aturan: AturanKos[]; // text[], default '{}'
  maks_penghuni: number | null; // integer 1-20, per kamar
  created_at: string; // timestamptz
};

export type Kamar = {
  id: string; // uuid
  kos_id: string; // uuid -> kos.id_kos (tanpa FK)
  nama: string;
  deskripsi: string | null;
  stok: number; // integer
  ketersediaan: Ketersediaan; // ditulis kode saat simpan: stok > 0 ? Tersedia : Penuh
  harga: number; // integer, per bulan (IDR)
  ukuran: string | null;
  created_at: string;
};

export type Galeri = {
  id: string; // uuid
  kos_id: string; // uuid -> kos.id_kos (tanpa FK)
  image_url: string; // URL publik bucket kos-foto (atau path lokal saat fallback)
  caption: string | null;
  created_at: string;
};

export type Fasilitas = {
  id: string; // uuid
  nama: string;
  created_at: string;
};

// Bentuk agregat untuk kartu listing.
export type KosCardData = {
  kos: Kos;
  cover: string | null; // galeri pertama (created_at ASC) atau null
  kamarTersedia: number; // jumlah tipe kamar dengan ketersediaan Tersedia
  kamarTotal: number;
  stokTersedia: number; // total stok kamar Tersedia
  fasilitas?: string[]; // nama fasilitas yang dimiliki kos (via kos_fasilitas; opsional untuk fallback statis)
};

// Bentuk agregat untuk halaman detail.
export type KosDetail = {
  kos: Kos;
  kamar: Kamar[];
  galeri: Galeri[];
  fasilitas: string[]; // nama fasilitas
};
