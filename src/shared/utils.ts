import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCompactCurrency(amount: number) {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
  return `$${amount.toLocaleString()}`;
}

export function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

export function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function profileName(
  row: { display_name?: string | null; full_name?: string | null; email?: string | null } | null | undefined,
  fallback = "Project Ace user"
): string {
  return row?.display_name || row?.full_name || (row?.email ? row.email.split("@")[0] : "") || fallback;
}

export function asString(value: string | string[] | undefined | null): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function now(): string {
  return new Date().toISOString();
}
