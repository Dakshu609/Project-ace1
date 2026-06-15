import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/database/supabase/database.types";
import type { UserRole } from "@/shared/types";
import { dashboardPathForRole } from "@/server/auth/utils";

const PROTECTED_PREFIXES = ["/dashboard", "/messages", "/admin"];
const AUTH_PATHS = ["/auth"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function updateSession(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname === "/auth/role" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (isProtectedPath(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | null;

    if (!role && pathname !== "/auth/role") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/role";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/client") && role === "freelancer") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/freelancer";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/freelancer") && role === "client") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/client";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardPathForRole(role);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthPath(pathname) && user && pathname !== "/auth/callback") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | null;

    if (!role && pathname !== "/auth/role") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/role";
      return NextResponse.redirect(url);
    }

    if (role && (pathname === "/auth" || pathname === "/auth/role")) {
      const redirect = request.nextUrl.searchParams.get("redirect");
      const url = request.nextUrl.clone();
      url.pathname = redirect ?? dashboardPathForRole(role);
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
