import { DashboardSidebar, type SidebarLink } from "@/client/components/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/client/components/dashboard/dashboard-mobile-nav";

interface DashboardLayoutProps {
  sidebarLinks: SidebarLink[];
  sidebarTitle: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  sidebarLinks,
  sidebarTitle,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <DashboardSidebar links={sidebarLinks} title={sidebarTitle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardMobileNav links={sidebarLinks} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
