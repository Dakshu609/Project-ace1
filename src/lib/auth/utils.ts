import type { UserRole } from "@/lib/types";

export function dashboardPathForRole(role: UserRole | null) {
  if (role === "freelancer") return "/dashboard/freelancer";
  if (role === "admin") return "/admin";
  return "/dashboard/client";
}
