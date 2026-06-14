"use client";

import { Briefcase, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthRole = "client" | "freelancer";

interface RoleSelectorProps {
  value: AuthRole;
  onChange: (role: AuthRole) => void;
}

const roles: { value: AuthRole; label: string; description: string; icon: typeof UserRound }[] = [
  {
    value: "client",
    label: "Client",
    description: "Hire talent & post jobs",
    icon: UserRound,
  },
  {
    value: "freelancer",
    label: "Freelancer",
    description: "Find work & offer services",
    icon: Briefcase,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {roles.map((role) => {
        const Icon = role.icon;
        const selected = value === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200",
              selected
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-input hover:border-primary/30 hover:bg-accent"
            )}
          >
            <Icon className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
            <span className="text-sm font-medium">{role.label}</span>
            <span className="text-xs text-muted-foreground">{role.description}</span>
          </button>
        );
      })}
    </div>
  );
}
