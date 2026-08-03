import { Shield, ShieldCheck, Crown, Users, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRoleDefinition } from "@/lib/auth/roles";
import type { Role } from "@/lib/auth/types";

const ROLE_ICONS: Record<Role, LucideIcon> = {
  HR_ADMIN: ShieldCheck,
  IT_ADMIN: Shield,
  EXECUTIVE: Crown,
  MANAGER: Users,
  EMPLOYEE: User,
};

export function RoleBadge({
  role,
  size = "default",
  className,
}: {
  role: Role;
  size?: "sm" | "default";
  className?: string;
}) {
  const definition = getRoleDefinition(role);
  const Icon = ROLE_ICONS[role];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 font-semibold uppercase tracking-[0.08em] text-primary",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden="true" />
      {definition.shortLabel}
    </span>
  );
}
