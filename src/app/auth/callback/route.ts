import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/database/supabase/server";
import { dashboardPathForRole } from "@/server/auth/utils";
import type { UserRole } from "@/shared/types";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const cookieStore = await cookies();
        const pendingRole = cookieStore.get("pending_role")?.value as
          | "client"
          | "freelancer"
          | undefined;

        let { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (pendingRole && !profile?.role) {
          await supabase
            .from("profiles")
            .update({ role: pendingRole, updated_at: new Date().toISOString() })
            .eq("id", user.id);

          await supabase.auth.updateUser({ data: { role: pendingRole } });
          profile = { role: pendingRole };
        }

        const role = profile?.role as UserRole | null;

        const response = NextResponse.redirect(
          `${origin}${
            !role
              ? `/auth/role?redirect=${encodeURIComponent(redirect)}`
              : redirect.startsWith("/dashboard") || redirect.startsWith("/messages")
                ? redirect
                : dashboardPathForRole(role)
          }`
        );

        if (pendingRole) {
          response.cookies.set("pending_role", "", { maxAge: 0, path: "/" });
        }

        return response;
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
