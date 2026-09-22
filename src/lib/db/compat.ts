// Fallback: petakan kosList statis ke bentuk DB agar halaman yang sudah migrasi
// tetap tampil saat tabel Supabase masih kosong. Hapus file ini beserta
// src/data/kos.ts setelah data produksi terisi dan fallback tidak dipakai lagi.
import { kosList } from "@/data/kos";
import type { KosCardData, KosDetail } from "./types";

const PLACEHOLDER = "/img/kos-placeholder.png";

export function getFallbackKosCards(): KosCardData[] {
  return kosList.map((k) => {
    const tersedia = k.kamar.filter((r) => r.ketersediaan === "Tersedia");
    return {
      kos: {
        id_kos: String(k.id),
        id_pemilik: "",
        nama: k.nama,
        tipe: k.tipe,
        lokasi: k.lokasi,
        alamat: k.alamat,
        harga: k.harga,
        status_publikasi: "tayang",
        deskripsi: k.deskripsi,
        rating: k.rating,
        ulasan: k.ulasanCount,
        created_at: "",
      },
      cover: k.gambar ?? PLACEHOLDER,
      kamarTersedia: tersedia.length,
      kamarTotal: k.kamar.length,
      stokTersedia: tersedia.reduce((a, r) => a + r.stok, 0),
    };
  });
}

export function getFallbackKosDetail(idKos: string): KosDetail | null {
  const k = kosList.find((item) => String(item.id) === idKos);
  if (!k) return null;
  return {
    kos: {
      id_kos: String(k.id),
      id_pemilik: "",
      nama: k.nama,
      tipe: k.tipe,
      lokasi: k.lokasi,
      alamat: k.alamat,
      harga: k.harga,
      status_publikasi: "tayang",
      deskripsi: k.deskripsi,
      rating: k.rating,
      ulasan: k.ulasanCount,
      created_at: "",
    },
    kamar: k.kamar.map((r) => ({
      id: `${k.id}-${r.nama}`,
      kos_id: String(k.id),
      nama: r.nama,
      deskripsi: r.deskripsi,
      stok: r.stok,
      ketersediaan: r.ketersediaan,
      harga: r.harga,
      ukuran: r.ukuran,
      created_at: "",
    })),
    galeri: k.images.map((src, i) => ({
      id: `${k.id}-img-${i}`,
      kos_id: String(k.id),
      image_url: src,
      caption: null,
      created_at: "",
    })),
    fasilitas: [...k.fasilitas],
  };
}
