import { cn } from "@/shared/utils";

interface DashboardSectionProps {
  id?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  id,
  title,
  action,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 mb-8", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
