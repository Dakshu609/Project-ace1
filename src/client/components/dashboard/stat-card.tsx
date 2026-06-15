import { Card, CardContent } from "@/client/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  trend?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-5 sm:p-6">
        {(Icon || trend) && (
          <div className="mb-3 flex items-center justify-between">
            {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
            {trend}
          </div>
        )}
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
