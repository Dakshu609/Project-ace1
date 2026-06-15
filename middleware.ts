import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/shared/types";

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

function dashboardPathForRole(role: UserRole | null): string {
  if (role === "admin") return "/admin";
  if (role === "freelancer") return "/dashboard/freelancer";
  if (role === "client") return "/dashboard/client";
  return "/auth/role";
}

export async function middleware(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

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

  // Role selection requires auth
  if (pathname === "/auth/role" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Protected paths
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

    // Role-specific access control
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

  // Auth paths when already logged in
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
