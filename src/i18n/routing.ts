import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Bahasa yang didukung
  locales: ["id", "en"],
  // Prefix selalu: /id/... dan /en/...
  localePrefix: "always",
  // Default bila negosiasi gagal
  defaultLocale: "id",
});

export type Locale = (typeof routing.locales)[number];
