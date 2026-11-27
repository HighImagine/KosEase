// Key alasan penolakan reservasi (pemesanan.alasan_key).
// Disimpan sebagai key, bukan kalimat, lalu diterjemahkan saat ditampilkan
// supaya bahasa penerima tidak ikut bahasa UI pemilik saat menolak.
// Teks bebas hanya dipakai untuk key "lainnya" (pemesanan.alasan_custom).

export const ALASAN_PENOLAKAN_KEYS = ["penuh", "tanggal", "data", "renovasi", "lainnya"] as const;

export type AlasanPenolakanKey = (typeof ALASAN_PENOLAKAN_KEYS)[number];

// Pilihan preset di panel tolak (semua key kecuali teks bebas "lainnya").
export const ALASAN_PENOLAKAN_PRESETS = ["penuh", "tanggal", "data", "renovasi"] as const;

export function isAlasanPenolakanKey(value: string): value is AlasanPenolakanKey {
  return (ALASAN_PENOLAKAN_KEYS as readonly string[]).includes(value);
}

// Label siap tampil. Fallback ke teks custom, lalu null kalau tidak ada data.
// Untuk "lainnya" tanpa teks custom, jangan tampilkan label prompt-nya.
export function alasanPenolakanLabel(
  key: string | null | undefined,
  custom: string | null | undefined,
  t: (key: AlasanPenolakanKey) => string,
): string | null {
  const customText = custom?.trim();
  if (key === "lainnya") return customText || null;
  if (key && isAlasanPenolakanKey(key)) return t(key);
  return customText || null;
}
