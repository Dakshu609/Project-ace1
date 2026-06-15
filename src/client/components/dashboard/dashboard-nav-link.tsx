"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CreditCard,
  Heart,
  MessageSquare,
  DollarSign,
  Star,
  Image as ImageIcon,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Briefcase,
  FileText,
  CreditCard,
  Heart,
  MessageSquare,
  DollarSign,
  Star,
  Image: ImageIcon,
  Settings,
  Shield,
};

export interface SidebarLink {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface DashboardNavLinkProps {
  link: SidebarLink;
  variant?: "sidebar" | "mobile";
}

export function DashboardNavLink({ link, variant = "sidebar" }: DashboardNavLinkProps) {
  const pathname = usePathname();
  const Icon = iconMap[link.icon] ?? LayoutDashboard;
  const active =
    pathname === link.href ||
    (link.href.includes("#") && pathname === link.href.split("#")[0]);

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 font-medium transition-colors",
        variant === "sidebar"
          ? "rounded-lg px-3 py-2.5 text-sm"
          : "shrink-0 snap-start rounded-full px-4 py-2 text-sm",
        active
          ? "bg-primary text-primary-foreground"
          : variant === "sidebar"
            ? "text-muted-foreground hover:bg-accent hover:text-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
}
