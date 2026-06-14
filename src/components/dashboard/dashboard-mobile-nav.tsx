"use client";

import { usePathname } from "next/navigation";
import {
  DashboardNavLink,
  type SidebarLink,
} from "@/components/dashboard/dashboard-sidebar";

interface DashboardMobileNavProps {
  links: SidebarLink[];
}

export function DashboardMobileNav({ links }: DashboardMobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur lg:hidden">
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 py-2">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href.includes("#") && pathname === link.href.split("#")[0]);
          return (
            <DashboardNavLink
              key={link.href}
              link={link}
              active={active}
              className="snap-start shrink-0 px-4"
            />
          );
        })}
      </div>
    </nav>
  );
}
