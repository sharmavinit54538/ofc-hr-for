import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Purely decorative animated mesh / aurora background with grain overlay.
 */
export function AnimatedBackground({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const blob = (delay: number, duration: number) =>
    reduced
      ? {}
      : {
          animate: { scale: [1, 1.16, 0.95, 1], x: ["0%", "6%", "-5%", "0%"], y: ["0%", "-7%", "5%", "0%"] },
          transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "noise-overlay pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-mesh" />

      <motion.div
        {...blob(0, 16)}
        className="absolute -left-40 -top-40 size-[38rem] rounded-full bg-primary/25 blur-[130px]"
      />
      <motion.div
        {...blob(1.5, 20)}
        className="absolute -bottom-52 right-[-10rem] size-[42rem] rounded-full bg-primary-glow/25 blur-[140px]"
      />
      <motion.div
        {...blob(3, 13)}
        className="absolute left-1/3 top-1/2 size-[30rem] rounded-full bg-accent/20 blur-[120px]"
      />

      <div
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0 0 0 / 60%), transparent 100%)",
        }}
      />
    </div>
  );
}
