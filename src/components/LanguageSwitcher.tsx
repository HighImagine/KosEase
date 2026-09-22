"use client";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Pilihan bahasa ID | EN. Pindah ke halaman yang sama beda locale;
// preferensi tersimpan via cookie oleh next-intl.
export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border px-1 py-1" title={t("language")}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => {
            if (loc !== locale) router.replace(pathname, { locale: loc });
          }}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
            loc === locale ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
