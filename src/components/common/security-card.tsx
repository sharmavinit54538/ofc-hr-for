import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SecurityCard({
  title,
  description,
  icon: Icon,
  action,
  tone = "default",
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  tone?: "default" | "critical";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "glass-panel rounded-2xl p-5 shadow-float sm:p-6",
        tone === "critical" && "border-destructive/30",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl",
                tone === "critical"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold leading-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </header>
      {children && <div className="mt-5">{children}</div>}
    </motion.section>
  );
}
