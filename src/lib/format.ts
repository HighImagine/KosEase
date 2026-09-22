// Helper format. Dipindah dari src/data/kos.ts agar halaman yang sudah migrasi
// ke Supabase tidak bergantung pada data statis.

export function formatHarga(harga: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(harga);
}
