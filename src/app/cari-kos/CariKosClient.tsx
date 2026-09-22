"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KosCard from "@/components/KosCard";
import type { KosCardData } from "@/lib/db/types";

export default function CariKosClient({ initial }: { initial: KosCardData[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const initialOnly = sp.get("available") === "1";
  const [onlyAvailable, setOnlyAvailable] = useState(initialOnly);
  const [q, setQ] = useState(sp.get("q") ?? "");

  const toggle = (v: boolean) => {
    setOnlyAvailable(v);
    const params = new URLSearchParams(sp.toString());
    if (v) params.set("available", "1"); else params.delete("available");
    router.replace(`/cari-kos?${params.toString()}`, { scroll: false });
  };

  const filtered = initial.filter(({ kos, kamarTersedia }) => {
    if (q && !`${kos.nama} ${kos.lokasi}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (onlyAvailable && kamarTersedia === 0) return false;
    return true;
  });

  return (
    <>
      <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm">
        <div className="flex gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari berdasarkan nama atau lokasi..." className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs cursor-pointer">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => toggle(e.target.checked)} className="accent-primary" />
            Hanya tersedia
          </label>
          <span className="text-xs text-text-secondary">Menampilkan {filtered.length} dari {initial.length} kos</span>
        </div>
      </div>

      <div className="mt-10">
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ kos, cover, kamarTersedia, kamarTotal, stokTersedia }) => (
            <KosCard
              key={kos.id_kos}
              id={kos.id_kos}
              nama={kos.nama}
              lokasi={kos.lokasi}
              harga={kos.harga}
              gambar={cover ?? "/img/kos-placeholder.png"}
              tipe={kos.tipe}
              kamarTersedia={kamarTersedia}
              kamarTotal={kamarTotal}
              stokTersedia={stokTersedia}
            />
          ))}
        </div>
        {filtered.length === 0 && <p className="mt-8 text-center text-sm text-text-secondary">Tidak ada kos tersedia dengan filter ini. Matikan toggle untuk lihat kos penuh.</p>}
      </div>
    </>
  );
}
