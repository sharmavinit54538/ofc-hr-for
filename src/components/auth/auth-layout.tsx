import { motion, useReducedMotion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AnimatedBackground } from "./animated-background";
import { AuthFooter } from "./auth-footer";
import { Logo } from "./logo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function AuthLayout({
  title,
  subtitle,
  children,
  badge,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  badge?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative flex min-h-screen flex-col no-scrollbar">
      {/* ── Decorative background (fixed behind everything) ──── */}
      <AnimatedBackground className="fixed inset-0" />

      {/* ── Header · logo only ─────────────────────────────────── */}
      <header className="relative z-20 flex h-16 shrink-0 items-center">
        <div className="mx-auto flex w-full max-w-[680px] items-center px-5">
          <Logo />
        </div>
      </header>

      {/* ── Main · centered card ───────────────────────────────── */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-8">
        <motion.div
          key={pathname}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="w-full max-w-[420px]"
        >
          <div className="glass-elevated rounded-2xl p-4 sm:p-5">
            {badge && <div className="mb-3">{badge}</div>}
            <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            )}
            <div className="mt-3">{children}</div>
          </div>
        </motion.div>
      </main>

      {/* ── Footer · always below content ──────────────────────── */}
      <div className="relative z-10 mt-auto">
        <AuthFooter />
      </div>
    </div>
  );
}
