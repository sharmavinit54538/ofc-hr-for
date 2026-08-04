import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  compact = false,
  variant = "default",
}: {
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
  variant?: "default" | "iconOnly";
}) {
  const reduced = useReducedMotion();

  // Icon only / Collapsed mode
  if (variant === "iconOnly" || (!showWordmark && compact)) {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        <motion.div
          whileHover={reduced ? {} : { scale: 1.05 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md border border-slate-200/60 dark:border-slate-800/60"
        >
          <img
            src="/ofc-hr-icon-transparent.png"
            alt="OFC HR"
            className="size-8 object-contain"
          />
        </motion.div>
      </div>
    );
  }

  // Full Logo display
  return (
    <div className={cn("group flex min-w-0 items-center gap-3", className)}>
      <motion.div
        whileHover={reduced ? {} : { scale: 1.03 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="relative flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-md border border-slate-200/60 dark:border-slate-800/60"
      >
        <img
          src="/ofc-hr-logo-transparent.png"
          alt="OFC HR - People • Process • Performance"
          className="h-8 w-auto object-contain max-w-[180px]"
        />
      </motion.div>
    </div>
  );
}

