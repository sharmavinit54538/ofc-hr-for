import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Building2, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/components/auth/loading-button";
import { SuccessState } from "@/components/common/success-state";
import type { RegistrationDraft } from "@/lib/auth/registration";

const provisioning = [
  { id: "tenant", label: "Provisioning enterprise tenant", icon: Building2 },
  { id: "policies", label: "Applying baseline security policies", icon: ShieldCheck },
  { id: "agents", label: "Activating AI workforce agents", icon: Sparkles },
  { id: "ready", label: "Workspace ready for sign-in", icon: Rocket },
];

export function SuccessStep({
  draft,
  onRedirect,
}: {
  draft: RegistrationDraft;
  onRedirect: () => void;
}) {
  const [completed, setCompleted] = useState(0);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (completed >= provisioning.length) return;
    const timer = setTimeout(() => setCompleted((c) => c + 1), 700);
    return () => clearTimeout(timer);
  }, [completed]);

  useEffect(() => {
    if (countdown <= 0) {
      onRedirect();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onRedirect]);

  return (
    <div className="space-y-6">
      <SuccessState
        title={`${draft.companyName ?? "Your organization"} is live on OFC HR`}
        description={
          <>
            The tenant was provisioned with{" "}
            <span className="font-semibold text-foreground">{draft.email}</span> as the first HR
            administrator. Sign in to finish onboarding your workforce.
          </>
        }
      />

      <ul className="space-y-2">
        {provisioning.map((item, index) => {
          const done = index < completed;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.12, duration: 0.35 }}
              className="glass-soft flex items-center gap-3 rounded-xl px-4 py-3"
            >
              <span
                className={
                  done
                    ? "grid size-7 place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow"
                    : "grid size-7 place-items-center rounded-lg bg-secondary text-muted-foreground"
                }
              >
                <item.icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium">{item.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {done ? "Done" : "Working"}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <div className="space-y-3">
        <Link to="/auth/login">
          <LoadingButton type="button">Continue to sign in</LoadingButton>
        </Link>
        <p className="text-center text-xs text-muted-foreground">
          Redirecting to sign in automatically in {countdown}s
        </p>
      </div>
    </div>
  );
}
