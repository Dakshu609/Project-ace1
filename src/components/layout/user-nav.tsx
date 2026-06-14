"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/actions";
import { dashboardPathForRole } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/supabase/database.types";
import type { UserRole } from "@/lib/types";

export function UserNav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="hidden h-9 w-20 animate-pulse rounded-lg bg-muted sm:block" />;
  }

  if (!profile) {
    return (
      <>
        <Link href="/auth" className="hidden sm:block">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/auth" className="hidden sm:block">
          <Button size="sm">Sign Up</Button>
        </Link>
      </>
    );
  }

  const dashboardHref = dashboardPathForRole(profile.role as UserRole | null);
  const displayName = profile.full_name || profile.email.split("@")[0];

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <Link href={dashboardHref}>
        <Button variant="ghost" size="sm" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </div>
        <span className="max-w-[120px] truncate text-sm font-medium">{displayName}</span>
      </div>
      <form action={signOut}>
        <Button variant="ghost" size="icon" type="submit" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
