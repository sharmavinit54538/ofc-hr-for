import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actions,
  icon,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass-soft flex flex-col items-center rounded-2xl px-6 py-10 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
        {icon ?? <Inbox className="size-5" aria-hidden="true" />}
      </span>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {actions && <div className="mt-5">{actions}</div>}
    </motion.div>
  );
}
