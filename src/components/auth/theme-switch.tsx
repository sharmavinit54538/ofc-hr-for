import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "@/features/ui/theme-store";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, hydrate, toggle, hydrated } = useThemeStore();
  const reduced = useReducedMotion();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isDark = hydrated ? theme === "dark" : true;

  const handleToggle = () => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => toggle());
      return;
    }
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "glass-tile group relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl transition-colors hover:bg-secondary/60",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 shadow-glow transition-opacity duration-300 group-hover:opacity-100" />
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid place-items-center"
        >
          {isDark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
