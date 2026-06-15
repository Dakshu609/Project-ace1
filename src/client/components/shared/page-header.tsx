import { cn } from "@/shared/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "page-header-gap flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="text-page-title">{title}</h1>
        {description && (
          <p className="mt-2 text-body-lg">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
