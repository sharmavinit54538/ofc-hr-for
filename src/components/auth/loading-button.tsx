import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  success?: boolean;
  variant?: "brand" | "ghost";
  children: ReactNode;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function LoadingButton({
  loading = false,
  success = false,
  variant = "brand",
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  const reduced = useReducedMotion();
  const state = success ? "success" : loading ? "loading" : "idle";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-70",
        variant === "brand" &&
          "bg-gradient-brand text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg",
        variant === "ghost" && "glass-tile text-foreground hover:-translate-y-0.5 hover:shadow-glow",
        className,
      )}
    >
      {/* sheen sweep on hover */}
      <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-foreground/10 transition-all duration-700 group-hover:left-[130%]" />

      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={state}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="relative flex min-w-0 items-center justify-center gap-2"
        >
          {state === "loading" && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          {state === "success" && <Check className="size-4" aria-hidden="true" />}
          <span className="inline-flex items-center justify-center gap-2">{children}</span>
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
