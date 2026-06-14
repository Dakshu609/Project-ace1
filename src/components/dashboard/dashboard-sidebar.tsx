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

export function getDashboardNavClassName(active: boolean, className?: string) {
  return cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
    active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
    className
  );
}

interface DashboardNavLinkProps {
  link: SidebarLink;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

export function DashboardNavLink({
  link,
  active,
  onClick,
  className,
}: DashboardNavLinkProps) {
  const Icon = iconMap[link.icon] ?? LayoutDashboard;

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={getDashboardNavClassName(active, className)}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {link.label}
    </Link>
  );
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
            const active =
              pathname === link.href ||
              (link.href.includes("#") && pathname === link.href.split("#")[0]);
            return (
              <DashboardNavLink key={link.href} link={link} active={active} />
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
