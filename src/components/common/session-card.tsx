import { motion } from "framer-motion";
import { Laptop, Smartphone, Monitor, ShieldCheck, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeviceSession } from "@/lib/auth/types";

function deviceIcon(device: string) {
  const value = device.toLowerCase();
  if (value.includes("iphone") || value.includes("android") || value.includes("pixel")) {
    return Smartphone;
  }
  if (value.includes("book") || value.includes("latitude") || value.includes("laptop")) {
    return Laptop;
  }
  return Monitor;
}

export function SessionCard({
  session,
  onRevoke,
  onTrustToggle,
}: {
  session: DeviceSession;
  onRevoke?: (id: string) => void;
  onTrustToggle?: (id: string) => void;
}) {
  const Icon = deviceIcon(session.device);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "glass-soft flex flex-wrap items-center gap-4 rounded-xl p-4 transition-shadow duration-300 hover:shadow-glow",
        !session.trusted && "border-destructive/30",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          session.trusted ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-40 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold">{session.device}</p>
          {session.current && (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-success">
              This device
            </span>
          )}
          {session.trusted && !session.current && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              <ShieldCheck className="size-2.5" aria-hidden="true" /> Trusted
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {session.os} · {session.browser} · {session.ip}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" aria-hidden="true" /> {session.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" /> {session.lastActive}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onTrustToggle && (
          <button
            type="button"
            onClick={() => onTrustToggle(session.id)}
            className="rounded-lg border border-input px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {session.trusted ? "Untrust" : "Trust"}
          </button>
        )}
        {onRevoke && !session.current && (
          <button
            type="button"
            onClick={() => onRevoke(session.id)}
            className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            Revoke
          </button>
        )}
      </div>
    </motion.article>
  );
}
