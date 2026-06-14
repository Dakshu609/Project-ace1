import Link from "next/link";
import { Suspense } from "react";
import { Zap } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            Project Ace
          </Link>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
