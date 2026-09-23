import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

type CookieToSet = { name: string; value: string; options: Record<string, unknown> };

// Kupas prefix /id|/en agar guard auth bekerja pada path kanonis.
// Redirect yang dihasilkan SELALU membawa prefix (dengan next tanpa prefix,
// karena next-intl akan menambahkannya otomatis).
function stripLocale(pathname: string): { locale: string; path: string } {
  const m = pathname.match(/^\/(id|en)(\/|$)/);
  if (!m) return { locale: routing.defaultLocale, path: pathname };
  const rest = pathname.slice(m[0].length);
  return { locale: m[1], path: rest ? `/${rest}` : "/" };
}

export default async function proxy(request: NextRequest) {
  const { locale, path } = stripLocale(request.nextUrl.pathname);

  const collected: CookieToSet[] = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          collected.push(
            ...(cookiesToSet as CookieToSet[])
          );
        },
      },
    }
  );

  const applyCookies = (res: NextResponse) => {
    collected.forEach(({ name, value, options }) =>
      res.cookies.set(name, value, options as never)
    );
    return res;
  };

  const { data: { user } } = await supabase.auth.getUser();

  // Area admin = /dashboard/admin/* SAJA. Halaman /admin (login admin)
  // diperlakukan publik seperti /login — kalau ikut dijaga, terjadi
  // ayam-telur: buka login admin malah dibuang ke /login.
  const isAdminPath = path.startsWith("/dashboard/admin");
  const isDashboard = path.startsWith("/dashboard");
  const isAuth = ["/login", "/register"].includes(path);

  if (!user && (isDashboard || isAdminPath)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("next", path);
    return applyCookies(NextResponse.redirect(url));
  }
  if (user && isAuth) {
    let role: string | null = null;
    try {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
      const profileDatum = profileData?.[0];
      role = (profileDatum?.role as string) ?? null;
    } catch {}
    const url = request.nextUrl.clone();
    const norm = role?.toLowerCase();
    if (norm === "pemilik" || norm === "pemilik_kos") {
      url.pathname = `/${locale}/dashboard`;
    } else if (norm === "admin") {
      url.pathname = `/${locale}/dashboard/admin`;
    } else {
      url.pathname = `/${locale}`;
    }
    url.search = "";
    return applyCookies(NextResponse.redirect(url));
  }
  if (user && isAdminPath) {
    let role: string | null = null;
    try {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
      const profileDatum = profileData?.[0];
      role = (profileDatum?.role as string) ?? null;
    } catch {}
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return applyCookies(NextResponse.redirect(url));
    }
  }

  // Lolos guard: jalankan routing locale, tempel cookie sesi yang di-refresh.
  const intlResponse = handleI18nRouting(request) as NextResponse;
  collected.forEach(({ name, value, options }) =>
    intlResponse.cookies.set(name, value, options as never)
  );
  return intlResponse;
}

export const config = {
  // Pola next-intl: semua path kecuali api/trpc/_next/_vercel/file berekstensi.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
