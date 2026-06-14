import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
  showValue?: boolean;
}

export function StarRating({ rating, className, showValue = true }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className="h-4 w-4 fill-warning text-warning" />
      {showValue && (
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
