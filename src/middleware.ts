import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuth = ["/login", "/register"].includes(request.nextUrl.pathname);

  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (user && isAuth) {
    // PRD 3 aktor: penyewa/user, pemilik kos, admin
    let role: string | null = null;
    try {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      role = (data?.role as string) ?? null;
    } catch {}
    const url = request.nextUrl.clone();
    const norm = role?.toLowerCase();
    if (norm === "pemilik" || norm === "pemilik_kos" || norm === "admin") url.pathname = "/dashboard";
    else url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
