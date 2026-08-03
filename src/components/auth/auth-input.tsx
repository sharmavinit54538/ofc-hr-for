import { motion, useReducedMotion } from "framer-motion";
import {
  forwardRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { ValidationMessage } from "./validation-message";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  trailing?: ReactNode | undefined;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, icon, error, hint, trailing, className, id, onFocus, onBlur, ...props },
    ref,
  ) => {
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    const [focused, setFocused] = useState(false);
    const reduced = useReducedMotion();

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(event);
    };

    return (
      <div className="space-y-1">
        <motion.label
          htmlFor={inputId}
          animate={
            reduced ? {} : { y: focused ? -1 : 0, letterSpacing: focused ? "0.14em" : "0.1em" }
          }
          transition={{ duration: 0.25, ease: EASE }}
          className={cn(
            "block text-xs font-semibold uppercase transition-colors duration-300",
            error
              ? "text-destructive"
              : focused
                ? "text-primary"
                : "text-muted-foreground",
          )}
        >
          {label}
        </motion.label>

        <div className="relative">
          {/* animated gradient focus ring */}
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ opacity: focused && !error ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none absolute -inset-px rounded-[13px] bg-gradient-brand opacity-0 blur-[2px]"
          />
          <div
            className={cn(
              "group relative flex items-center gap-2 rounded-xl border bg-card/70 px-3.5 backdrop-blur-xl transition-all duration-300",
              focused && !error && "border-transparent shadow-glow",
              error ? "border-destructive/60" : !focused && "border-input",
            )}
          >
            {icon && (
              <span
                className={cn(
                  "shrink-0 transition-colors duration-300",
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              >
                {icon}
              </span>
            )}
            <input
              id={inputId}
              ref={ref}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70",
                className,
              )}
              {...props}
            />
            {trailing && <span className="shrink-0">{trailing}</span>}
          </div>
        </div>

        {error ? (
          <ValidationMessage message={error} />
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
