"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Toggle bahasa ringkas gaya sidebar. Dipakai di semua sidebar role.
export default function SidebarLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navbar");

  return (
    <div className="px-4 pb-1" title={t("language")}>
      <div className="flex items-center gap-1 rounded-lg border border-border px-1 py-1">
        <span className="px-1 text-xs">🌐</span>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => {
              if (loc !== locale) router.replace(pathname, { locale: loc });
            }}
            className={`flex-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
              loc === locale ? "bg-primary text-white" : "text-text-secondary hover:text-primary"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
