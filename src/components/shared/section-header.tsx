import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
