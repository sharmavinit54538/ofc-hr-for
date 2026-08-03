import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/services/employeeDashboardApi";
import type { AppNotification } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

const toneClass: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  critical: "bg-destructive/10 text-destructive",
};

export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: notificationsRes } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [markRead] = useMarkNotificationsReadMutation();

  const items: AppNotification[] = (notificationsRes?.data ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    timestamp: n.timestamp,
    read: n.read,
    tone: (n.tone as any) || "info",
  }));

  const unread = items.filter((item) => !item.read).length;

  const handleMarkAllRead = async () => {
    try {
      await markRead().unwrap();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="glass-soft relative grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-gradient-brand text-[9px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass-panel absolute right-0 z-50 mt-2 w-80 rounded-2xl p-3 shadow-float"
          >
            <div className="flex items-center justify-between px-1 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Notifications
              </p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:opacity-80"
                >
                  <Check className="size-3" aria-hidden="true" /> Mark all read
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <EmptyState title="You're all caught up" />
            ) : (
              <ul className="space-y-1.5 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary",
                        !item.read && "bg-secondary/60",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-1 size-2 shrink-0 rounded-full",
                            toneClass[item.tone] || toneClass["info"],
                          )}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{item.title}</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                            {item.timestamp}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
