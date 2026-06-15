import type { UserRole } from "@/shared/types";

export function dashboardPathForRole(role: UserRole | null) {
  if (role === "freelancer") return "/dashboard/freelancer";
  if (role === "admin") return "/admin";
  return "/dashboard/client";
}

export function safeInternalPath(path: string | null | undefined, fallback = "/") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;

  try {
    const url = new URL(path, "https://project-ace.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
