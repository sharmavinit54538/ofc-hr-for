import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ValidationMessage } from "./validation-message";

type AuthSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon?: ReactNode | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  options: string[];
  placeholder?: string;
};

/** Select styled to match AuthInput exactly — same borders, focus glow, spacing. */
export const AuthSelect = forwardRef<HTMLSelectElement, AuthSelectProps>(
  ({ label, icon, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
        >
          {label}
        </label>
        <div
          className={cn(
            "group relative flex items-center gap-2 rounded-xl border bg-card/70 px-3.5 transition-all duration-300",
            "focus-within:border-ring focus-within:shadow-glow",
            error ? "border-destructive/60" : "border-input",
          )}
        >
          {icon && (
            <span className="shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary">
              {icon}
            </span>
          )}
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(
              "min-w-0 flex-1 appearance-none bg-transparent py-3 text-sm outline-none",
              className,
            )}
            {...props}
          >
            <option value="">{placeholder ?? "Select an option"}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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

AuthSelect.displayName = "AuthSelect";
