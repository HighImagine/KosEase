// Tile angka ringkas untuk beranda dashboard (admin & penyewa).
// Dipakai di src/app/[locale]/dashboard/page.tsx dan dashboard/admin/page.tsx.
export default function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
      <p className="font-heading text-xl font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}
