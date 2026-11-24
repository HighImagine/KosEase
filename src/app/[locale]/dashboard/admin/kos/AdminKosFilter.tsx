"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export default function AdminKosFilter() {
  const t = useTranslations("AdminKos");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "semua";
  const [qState, setQState] = useState(q);
  const [statusState, setStatusState] = useState(status);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const qVal = qState.trim();
    if (qVal) params.set("q", qVal);
    if (statusState && statusState !== "semua") params.set("status", statusState);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <form onSubmit={submit} className="mb-4 flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={qState}
        onChange={(e) => setQState(e.target.value)}
        placeholder={t("search")}
        className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary"
      />
      <select
        value={statusState}
        onChange={(e) => setStatusState(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text-primary"
      >
        <option value="semua">{t("statusAll")}</option>
        <option value="draft">{t("statusDraft")}</option>
        <option value="tayang">{t("statusTayang")}</option>
      </select>
      <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark">
        {t("filter")}
      </button>
    </form>
  );
}
