export type TipeKos = "Campur" | "Laki-laki" | "Perempuan";
export type StatusKamar = "Tersedia" | "Hampir Penuh" | "Penuh";

export type Fasilitas = string; // e.g. "WiFi", "AC", "Kamar Mandi Dalam"

export type TipeKamar = {
  nama: string; // e.g. "Standard", "Deluxe"
  ukuran: string; // e.g. "3 × 4 m"
  harga: number; // per bulan, angka murni untuk filter/sort
  ketersediaan: StatusKamar;
  stok: number;
};

export type Kos = {
  id: number;
  nama: string;
  lokasi: string; // kota/kecamatan singkat
  alamat: string;
  harga: number; // harga termurah per bulan
  gambar: string; // thumbnail utama
  images: string[]; // gallery untuk detail
  tipe: TipeKos;
  status: string; // label ringkas, e.g. "Tersedia 2 Kamar"
  deskripsi: string;
  fasilitas: Fasilitas[];
  rating: number; // 0-5
  ulasanCount: number;
  kamar: TipeKamar[];
};

export function formatHarga(harga: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(harga);
}

export const tipeStyles: Record<TipeKos, string> = {
  Campur: "bg-type-campur-bg text-type-campur-text",
  "Laki-laki": "bg-type-laki-bg text-type-laki-text",
  Perempuan: "bg-type-perempuan-bg text-type-perempuan-text",
};

export const kosList: Kos[] = [
  {
    id: 1,
    nama: "Kos Melati",
    lokasi: "Yogyakarta",
    alamat: "Jl. Kaliurang KM 5, Sleman, Yogyakarta",
    harga: 800000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Perempuan",
    status: "Tersedia 2 Kamar",
    deskripsi: "Kos eksklusif putri dekat UGM dengan lingkungan tenang, akses 24 jam, dan penjagaan CCTV.",
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Dapur Bersama", "Parkir Motor"],
    rating: 4.8,
    ulasanCount: 24,
    kamar: [
      { nama: "Standard", ukuran: "3 × 4 m", harga: 800000, ketersediaan: "Tersedia", stok: 2 },
      { nama: "Deluxe", ukuran: "4 × 4 m", harga: 1100000, ketersediaan: "Hampir Penuh", stok: 1 },
    ],
  },
  {
    id: 2,
    nama: "Kos Mawar",
    lokasi: "Bandung",
    alamat: "Jl. Dago No. 45, Bandung",
    harga: 1000000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Campur",
    status: "Tersedia",
    deskripsi: "Kos campur strategis dekat ITB, cocok untuk mahasiswa dan pekerja muda. Listrik sudah termasuk.",
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir Motor", "Mesin Cuci Bersama"],
    rating: 4.6,
    ulasanCount: 18,
    kamar: [
      { nama: "Standard", ukuran: "3 × 3 m", harga: 1000000, ketersediaan: "Tersedia", stok: 3 },
    ],
  },
  {
    id: 3,
    nama: "Kos Dahlia",
    lokasi: "Malang",
    alamat: "Jl. Veteran No. 12, Malang",
    harga: 750000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Laki-laki",
    status: "Tersedia 2 Kamar",
    deskripsi: "Kos putra ekonomis dekat UB dengan fasilitas lengkap dan area parkir luas.",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor Luas", "Dapur Bersama"],
    rating: 4.5,
    ulasanCount: 12,
    kamar: [
      { nama: "Standard", ukuran: "3 × 4 m", harga: 750000, ketersediaan: "Tersedia", stok: 2 },
      { nama: "Deluxe", ukuran: "4 × 5 m", harga: 950000, ketersediaan: "Tersedia", stok: 1 },
    ],
  },
  {
    id: 4,
    nama: "Kos Anggrek",
    lokasi: "Jakarta Selatan",
    alamat: "Jl. Kemang Raya No. 8, Jakarta Selatan",
    harga: 1500000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Campur",
    status: "Hampir Penuh",
    deskripsi: "Kos premium di Kemang dengan desain modern, cocok untuk profesional muda. Akses TransJakarta dekat.",
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir Motor", "Dapur Bersama", "Mesin Cuci Bersama"],
    rating: 4.9,
    ulasanCount: 32,
    kamar: [
      { nama: "Standard", ukuran: "3 × 4 m", harga: 1500000, ketersediaan: "Hampir Penuh", stok: 1 },
      { nama: "Suite", ukuran: "5 × 4 m", harga: 2200000, ketersediaan: "Tersedia", stok: 2 },
    ],
  },
  {
    id: 5,
    nama: "Kos Kenanga",
    lokasi: "Surabaya",
    alamat: "Jl. Ngagel No. 77, Surabaya",
    harga: 900000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Perempuan",
    status: "Tersedia",
    deskripsi: "Kos putri nyaman dekat ITS dan UNAIR, lingkungan aman dengan penjaga 24 jam.",
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Parkir Motor"],
    rating: 4.7,
    ulasanCount: 15,
    kamar: [
      { nama: "Standard", ukuran: "3 × 4 m", harga: 900000, ketersediaan: "Tersedia", stok: 4 },
    ],
  },
  {
    id: 6,
    nama: "Kos Flamboyan",
    lokasi: "Yogyakarta",
    alamat: "Jl. Gejayan No. 20, Sleman, Yogyakarta",
    harga: 650000,
    gambar: "/img/kos-placeholder.png",
    images: ["/img/kos-placeholder.png", "/img/kos-placeholder.png", "/img/kos-placeholder.png"],
    tipe: "Laki-laki",
    status: "Tersedia",
    deskripsi: "Kos putra murah dekat UNY dan UGM, cocok untuk mahasiswa baru.",
    fasilitas: ["WiFi", "Parkir Motor Luas", "Dapur Bersama"],
    rating: 4.3,
    ulasanCount: 9,
    kamar: [
      { nama: "Standard", ukuran: "3 × 3 m", harga: 650000, ketersediaan: "Tersedia", stok: 5 },
    ],
  },
];
