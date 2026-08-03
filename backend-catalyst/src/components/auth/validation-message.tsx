import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ValidationMessage({
  message,
  tone = "error",
  className,
}: {
  message?: string | null;
  tone?: "error" | "success" | "info";
  className?: string;
}) {
  if (!message) return null;

  const Icon =
    tone === "success" ? CheckCircle2 : tone === "info" ? Info : AlertCircle;

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-1.5 text-xs font-medium",
        tone === "error" && "text-destructive",
        tone === "success" && "text-success",
        tone === "info" && "text-muted-foreground",
        className,
      )}
    >
      <Icon className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
