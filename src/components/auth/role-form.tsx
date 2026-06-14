"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUserRole } from "@/lib/auth/actions";
import { dashboardPathForRole } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleSelector, type AuthRole } from "@/components/auth/role-selector";

export function RoleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";
  const [role, setRole] = useState<AuthRole>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const pendingRole = sessionStorage.getItem("pending_role") as AuthRole | null;
    const selectedRole = pendingRole ?? role;

    const result = await updateUserRole(selectedRole);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    sessionStorage.removeItem("pending_role");
    document.cookie = "pending_role=; path=/; max-age=0";

    const destination = redirect || dashboardPathForRole(selectedRole);
    router.push(destination);
    router.refresh();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose your role</CardTitle>
        <CardDescription>
          Tell us how you&apos;ll use Project Ace. You can update this later in settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>I am a</Label>
            <RoleSelector value={role} onChange={setRole} />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
