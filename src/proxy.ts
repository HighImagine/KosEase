import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
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

  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuth = ["/login", "/register"].includes(request.nextUrl.pathname);

  if (!user && (isDashboard || isAdmin)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
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
    if (norm === "pemilik") {
      url.pathname = "/dashboard";
    } else if (norm === "admin") {
      url.pathname = "/";
    } else {
      url.pathname = "/";
    }
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (user && isAdmin) {
    let role: string | null = null;
    try {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).limit(1);
      const profileDatum = profileData?.[0];
      role = (profileDatum?.role as string) ?? null;
    } catch {}
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
