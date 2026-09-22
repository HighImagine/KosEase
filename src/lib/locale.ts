// Helper prefix locale untuk redirect di server actions (yang tidak kenal locale).
// Semua path internal SELALU dibentuk lewat sini bila redirect dari action.

export function withLocale(path: string, locale: string | null | undefined): string {
  const loc = locale === "en" ? "en" : "id";
  if (path.startsWith("/en/") || path.startsWith("/id/")) return path;
  if (path === "/en" || path === "/id") return path;
  return `/${loc}${path === "/" ? "" : path}`;
}

// Ambil locale dari FormData (hidden input `locale` di setiap form yang redirect).
export function formLocale(formData: FormData): string {
  const v = formData.get("locale");
  return v === "en" ? "en" : "id";
}
