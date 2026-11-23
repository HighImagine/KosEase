"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { IconWorld } from "@tabler/icons-react";

// Dropdown pemilih bahasa (ID | EN). Pindah ke halaman yang sama beda locale;
// preferensi tersimpan via cookie oleh next-intl.
export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);

  const select = (loc: string) => {
    setOpen(false);
    if (loc !== locale) router.replace(pathname, { locale: loc });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t("language")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-background hover:text-primary"
      >
        <IconWorld className="h-7 w-7" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => select(loc)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-xs hover:bg-black/5 ${loc === locale ? "font-medium text-primary" : "text-text-primary"}`}
            >
              {loc === "id" ? t("indonesian") : t("english")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
