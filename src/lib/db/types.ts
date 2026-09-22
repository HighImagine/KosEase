// Tipe baris database (schema public, tanpa FK constraint).
// Cerminkan 1:1 dengan kolom + tipe di Supabase. Jangan menambah kolom di sini
// tanpa migrasi SQL terlebih dahulu.

export type TipeKos = "Campur" | "Laki-laki" | "Perempuan";
export type StatusPublikasi = "draft" | "tayang";
export type Ketersediaan = "Tersedia" | "Penuh";

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
};

// Bentuk agregat untuk halaman detail.
export type KosDetail = {
  kos: Kos;
  kamar: Kamar[];
  galeri: Galeri[];
  fasilitas: string[]; // nama fasilitas
};
