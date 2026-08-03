import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RememberMe({
  checked,
  onCheckedChange,
  label = "Keep me signed in",
  className,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "group flex min-w-0 items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-300",
          checked
            ? "border-transparent bg-gradient-brand shadow-glow"
            : "border-input bg-card/60",
        )}
      >
        <Check
          className={cn(
            "size-3.5 text-primary-foreground transition-transform duration-300",
            checked ? "scale-100" : "scale-0",
          )}
        />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
