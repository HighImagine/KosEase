"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { IconBuilding, IconMapPin, IconTag } from "@tabler/icons-react";
import KosCard from "@/components/KosCard";
import SearchDropdown from "@/components/SearchDropdown";
import type { KosCardData } from "@/lib/db/types";
import { formatHarga } from "@/lib/format";

type OpenPanel = "location" | "facility" | "price" | null;

export default function CariKosClient({ initial }: { initial: KosCardData[] }) {
  const t = useTranslations("Search");
  const router = useRouter();
  const sp = useSearchParams();
  const initialOnly = sp.get("available") === "1";
  const [onlyAvailable, setOnlyAvailable] = useState(initialOnly);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [lokasi, setLokasi] = useState("");
  const [fasilitas, setFasilitas] = useState<string[]>([]);
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  const locations = Array.from(new Set(initial.map((c) => c.kos.lokasi).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const availableFasilitas = Array.from(new Set(initial.flatMap((c) => c.fasilitas ?? [])))
    .filter((nama) => nama !== "Parkir Motor Luas")
    .sort((a, b) => a.localeCompare(b));

  const hargaList = Array.from(new Set(initial.map((c) => c.kos.harga).filter((h) => h > 0))).sort((a, b) => a - b);
  const hargaMin = hargaList[0] ?? 0;
  const hargaMax = hargaList[hargaList.length - 1] ?? 0;
  const [maxHarga, setMaxHarga] = useState(hargaMax);

  const setOpen = (panel: Exclude<OpenPanel, null>, open: boolean) => {
    setOpenPanel((cur) => (cur === panel ? (open ? panel : null) : panel));
  };

  const toggleFasilitas = (nama: string) => {
    setFasilitas((prev) => (prev.includes(nama) ? prev.filter((n) => n !== nama) : [...prev, nama]));
  };

  const toggleOnlyAvailable = (v: boolean) => {
    setOnlyAvailable(v);
    const params = new URLSearchParams(sp.toString());
    if (v) params.set("available", "1"); else params.delete("available");
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  };

  const resetFilters = () => {
    setLokasi("");
    setFasilitas([]);
    setMaxHarga(hargaMax);
  };

  const filtered = initial.filter(({ kos, kamarTersedia, fasilitas: kosFasilitas }) => {
    if (q && !`${kos.nama} ${kos.lokasi}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (lokasi && kos.lokasi !== lokasi) return false;
    if (fasilitas.length > 0 && !(kosFasilitas ?? []).every((f) => fasilitas.includes(f))) return false;
    if (kos.harga < hargaMin || kos.harga > maxHarga) return false;
    if (onlyAvailable && kamarTersedia === 0) return false;
    return true;
  });

  const hasActiveFilters = lokasi !== "" || fasilitas.length > 0 || maxHarga < hargaMax;

  return (
    <>
      <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm">
        <div className="flex gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Bagian 1 — Dropdown Lokasi */}
          <div>
            <SearchDropdown
              label={lokasi || t("allLocations")}
              icon={<IconMapPin size={16} className="text-primary" />}
              open={openPanel === "location"}
              onOpenChange={(o) => setOpen("location", o)}
            >
              <div className="max-h-56 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setLokasi("");
                    setOpenPanel(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${lokasi === "" ? "bg-primary-light font-semibold text-text-primary" : "text-text-primary hover:bg-background"}`}
                >
                  {t("allLocations")}
                </button>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLokasi(loc);
                      setOpenPanel(null);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${lokasi === loc ? "bg-primary-light font-semibold text-text-primary" : "text-text-primary hover:bg-background"}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </SearchDropdown>
          </div>

          {/* Bagian 2 — Dropdown Fasilitas */}
          <div>
            <SearchDropdown
              label={fasilitas.length > 0 ? `${fasilitas.length} ${t("selected")}` : t("facility")}
              icon={<IconBuilding size={16} className="text-primary" />}
              open={openPanel === "facility"}
              onOpenChange={(o) => setOpen("facility", o)}
            >
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={fasilitas.length === 0} onChange={() => { setFasilitas([]); setOpenPanel(null); }} className="accent-primary" />
                  {t("allFacilities")}
                </label>
                {availableFasilitas.map((nama) => (
                  <label key={nama} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="accent-primary" checked={fasilitas.includes(nama)} onChange={() => toggleFasilitas(nama)} />
                    {nama}
                  </label>
                ))}
              </div>
            </SearchDropdown>
          </div>

          {/* Bagian 3 — Dropdown Harga */}
          <div>
            <SearchDropdown
              label={`${formatHarga(hargaMin)} – ${formatHarga(maxHarga)}`}
              icon={<IconTag size={16} className="text-primary" />}
              open={openPanel === "price"}
              onOpenChange={(o) => setOpen("price", o)}
            >
              <div className="flex flex-col gap-3">
                <input type="range" min={hargaMin} max={hargaMax} value={maxHarga} onChange={(e) => setMaxHarga(Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>{formatHarga(hargaMin)}</span>
                  <span>{formatHarga(maxHarga)}</span>
                </div>
              </div>
            </SearchDropdown>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs cursor-pointer">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => toggleOnlyAvailable(e.target.checked)} className="accent-primary" />
            {t("onlyAvailable")}
          </label>
          <span className="text-xs text-text-secondary">{t("showing", { a: filtered.length, b: initial.length })}</span>
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="ml-auto rounded-lg border border-border px-4 py-2.5 text-xs text-text-secondary hover:bg-primary-light">
              {t("reset")}
            </button>
          )}
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
        {filtered.length === 0 && <p className="mt-8 text-center text-sm text-text-secondary">{t("empty")}</p>}
      </div>
    </>
  );
}
