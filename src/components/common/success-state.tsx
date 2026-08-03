import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SuccessState({
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
    <div className={cn("text-center", className)} role="status">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow"
      >
        {icon ?? <CheckCircle2 className="size-8" aria-hidden="true" />}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="mt-5 font-display text-xl font-bold"
      >
        {title}
      </motion.h3>
      {description && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.div>
      )}
      {actions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mt-6 space-y-3"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}
