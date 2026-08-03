import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingOverlay({
  label = "Loading",
  fullscreen = true,
  className,
}: {
  label?: string;
  fullscreen?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "grid place-items-center",
        fullscreen ? "min-h-screen w-full" : "min-h-48 w-full",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-4 shadow-float"
      >
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </motion.div>
    </div>
  );
}
