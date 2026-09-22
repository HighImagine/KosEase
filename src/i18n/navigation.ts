import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrapper sadar-locale pengganti next/navigation & next/link.
// WAJIB dipakai di semua Link/redirect/useRouter/usePathname agar prefix bahasa ikut.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
