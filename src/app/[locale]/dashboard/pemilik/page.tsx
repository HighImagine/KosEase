import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { withLocale } from "@/lib/locale";

// Beranda pemilik lama: isinya sudah pindah ke /dashboard (OwnerHome).
// Dipertahankan sebagai redirect supaya tautan/bookmark lama tidak 404.
export default async function PemilikHomeRedirect() {
  redirect(withLocale("/dashboard", await getLocale()));
}
