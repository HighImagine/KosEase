import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Bahasa yang didukung
  locales: ["id", "en"],
  // Prefix selalu: /id/... dan /en/...
  localePrefix: "always",
  // Default bila negosiasi gagal
  defaultLocale: "id",
  // Jangan deteksi dari Accept-Language/cookie: kunjungan pertama ke "/"
  // selalu diarahkan ke /id. Pengguna tetap bisa pilih English lewat switcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
