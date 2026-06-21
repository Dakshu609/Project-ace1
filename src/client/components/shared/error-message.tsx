import { AlertCircle } from "lucide-react";
import { Button } from "@/client/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({
  title = "Error",
  message,
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-muted-foreground">{message}</p>
        {retry && (
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
