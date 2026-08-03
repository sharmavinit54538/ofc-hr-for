import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
}

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: StepperStep[];
  current: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex w-full items-start gap-2", className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-all duration-300",
                  done && "border-transparent bg-gradient-brand text-primary-foreground shadow-glow",
                  active && !done && "border-primary text-primary",
                  !done && !active && "border-input text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className="relative h-px flex-1 overflow-hidden rounded-full bg-border">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-gradient-brand"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-[11px] font-semibold uppercase tracking-[0.08em]",
                  active || done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
