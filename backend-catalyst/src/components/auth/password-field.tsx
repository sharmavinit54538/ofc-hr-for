import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useMemo, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { AuthInput } from "./auth-input";

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | undefined;
  hint?: string | undefined;
  showStrength?: boolean;
  value?: string;
};

const levels = ["Weak", "Fair", "Good", "Strong"] as const;
const barColors = [
  "bg-destructive",
  "bg-primary-glow",
  "bg-accent",
  "bg-success",
] as const;
const textColors = [
  "text-destructive",
  "text-muted-foreground",
  "text-accent",
  "text-success",
] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { label = "Password", error, hint, showStrength = false, value, ...props },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();

    const strValue = typeof value === "string" ? value : "";

    const score = useMemo(() => {
      let s = 0;
      if (strValue.length >= 8) s++;
      if (/[A-Z]/.test(strValue) && /[a-z]/.test(strValue)) s++;
      if (/\d/.test(strValue)) s++;
      if (/[^A-Za-z0-9]/.test(strValue)) s++;
      return s;
    }, [strValue]);

    const index = Math.max(0, score - 1);

    return (
      <div className="space-y-2">
        <AuthInput
          ref={ref}
          label={label}
          error={error}
          hint={hint}
          type={visible ? "text" : "password"}
          icon={<Lock className="size-4" />}
          {...(value !== undefined ? { value } : {})}
          trailing={
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          {...props}
        />
        {showStrength && strValue.length > 0 && (
          <div className="space-y-1.5">
            <div className="h-1 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={false}
                animate={{ width: `${(score / 4) * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                className={cn("h-full rounded-full", barColors[index])}
              />
            </div>
            <p
              className={cn(
                "text-[11px] font-medium transition-colors duration-300",
                textColors[index],
              )}
            >
              Password strength: {levels[index]}
            </p>
          </div>
        )}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
