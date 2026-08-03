import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  compact = false,
}: {
  className?: string;
  showWordmark?: boolean;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("group flex min-w-0 items-center gap-3", className)}>
      <motion.div
        whileHover={reduced ? {} : { rotate: -6, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-glow"
      >
        <span className="font-display text-sm font-bold tracking-tight text-primary-foreground">
          OFC
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-glow-lg transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>
      {showWordmark && (
        <div className="min-w-0">
          <p className="truncate font-display text-base font-bold leading-tight">
            OFC HR
          </p>
          {!compact && (
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Office Function Consolidator
            </p>
          )}
        </div>
      )}
    </div>
  );
}
