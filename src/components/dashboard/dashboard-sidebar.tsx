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
import { cn } from "@/lib/utils";

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

interface DashboardSidebarProps {
  links: SidebarLink[];
  title: string;
}

export function DashboardSidebar({ links, title }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:block">
      <div className="sticky top-16 p-6">
        <h2 className="mb-6 text-lg font-semibold">{title}</h2>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = iconMap[link.icon] ?? LayoutDashboard;
            const active =
              pathname === link.href ||
              (link.href.includes("#") && pathname === link.href.split("#")[0]);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
