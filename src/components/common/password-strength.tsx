import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { evaluatePassword, PASSWORD_REQUIREMENTS } from "@/lib/auth/password";

const barTone = ["bg-border", "bg-destructive", "bg-destructive", "bg-primary", "bg-primary", "bg-success"];

export function PasswordStrength({
  value,
  showRequirements = true,
  className,
}: {
  value: string;
  showRequirements?: boolean;
  className?: string;
}) {
  const result = evaluatePassword(value);

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: result.max }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              index < result.score ? barTone[result.score] : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium text-muted-foreground" aria-live="polite">
        Password strength:{" "}
        <span
          className={cn(
            "font-semibold",
            result.score >= 5 && "text-success",
            result.score === 4 && "text-primary",
            result.score > 0 && result.score <= 3 && "text-destructive",
          )}
        >
          {result.level}
        </span>
      </p>

      {showRequirements && (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const met = result.met.includes(requirement.id);
              return (
                <motion.li
                  key={requirement.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <span
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-300",
                      met ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {met ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                  </span>
                  <span className={cn(met && "text-foreground")}>{requirement.label}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
