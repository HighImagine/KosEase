"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Kos } from "@/lib/db/types";

type Props = {
  kos: Kos[];
};

export default function KamarFilter({ kos }: Props) {
  const t = useTranslations("KamarList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [kosId, setKosId] = useState(searchParams.get("kos") ?? "semua");
  const [status, setStatus] = useState(searchParams.get("status") ?? "semua");

  const navigate = (next: { q: string; kos: string; status: string }) => {
    const params = new URLSearchParams();
    const keyword = next.q.trim();
    if (keyword) params.set("q", keyword);
    if (next.kos !== "semua") params.set("kos", next.kos);
    if (next.status !== "semua") params.set("status", next.status);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kos spesifik dan search tidak dipakai bersamaan: memilih kos
    // mengosongkan search agar kos tersebut langsung tampil lengkap.
    const nextQ = kosId === "semua" ? q : "";
    if (kosId !== "semua") setQ("");
    navigate({ q: nextQ, kos: kosId, status });
  };

  const handleKosChange = (value: string) => {
    setKosId(value);
    if (value !== "semua") setQ("");
  };

  const reset = () => {
    setQ("");
    setKosId("semua");
    setStatus("semua");
    navigate({ q: "", kos: "semua", status: "semua" });
  };

  const hasFilter = !!searchParams.toString();

  return (
    <form onSubmit={submit} className="mb-5 flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search")}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
      />
      <select
        value={kosId}
        onChange={(e) => handleKosChange(e.target.value)}
        aria-label={t("filterKos")}
        className="max-w-44 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary"
      >
        <option value="semua">{t("allKos")}</option>
        {kos.map((k) => (
          <option key={k.id_kos} value={k.id_kos}>
            {k.nama}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label={t("filterStatus")}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary"
      >
        <option value="semua">{t("statusAll")}</option>
        <option value="tersedia">{t("statusAvailable")}</option>
        <option value="penuh">{t("statusFull")}</option>
      </select>
      <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">
        {t("apply")}
      </button>
      {hasFilter && (
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary"
        >
          {t("reset")}
        </button>
      )}
    </form>
  );
}
