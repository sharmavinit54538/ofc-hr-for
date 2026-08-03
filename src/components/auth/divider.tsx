import { cn } from "@/lib/utils";

export function Divider({
  label = "or continue with",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
