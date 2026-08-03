import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ErrorState({
  title,
  description,
  actions,
  icon,
  code,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  code?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)} role="alert">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto grid size-16 place-items-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive"
      >
        {icon ?? <AlertTriangle className="size-8" aria-hidden="true" />}
      </motion.div>
      {code && (
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Error {code}
        </p>
      )}
      <h3 className="mt-2 font-display text-xl font-bold">{title}</h3>
      {description && (
        <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
      )}
      {actions && <div className="mt-6 space-y-3">{actions}</div>}
    </div>
  );
}
