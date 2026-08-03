import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, UserCircle2, Building2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useGetMeQuery, useLogoutMutation } from "@/services/authApi";
import { getRoleDefinition } from "@/lib/auth/roles";
import { RoleBadge } from "./role-badge";

export function ProfileDropdown({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: meData } = useGetMeQuery();
  const [logoutMutation] = useLogoutMutation();

  const user = meData?.data;

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

  if (!user) return null;

  const fullName = user.full_name || "User Account";
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Local session cleared automatically by mutation onQueryStarted
    } finally {
      navigate({ to: "/auth/login" } as any);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="glass-soft flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-shadow duration-300 hover:shadow-glow"
      >
        <span className="grid size-7 place-items-center overflow-hidden rounded-lg bg-gradient-brand text-[11px] font-bold text-primary-foreground">
          {initials}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block truncate text-xs font-semibold">{fullName}</span>
          <span className="block truncate text-[10px] text-muted-foreground">
            {getRoleDefinition(user.role).shortLabel}
          </span>
        </span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-card absolute right-0 z-50 mt-2 w-64 p-2 shadow-2xl"
          >
            <div className="border-b border-border/40 p-2 text-xs">
              <p className="font-semibold text-foreground">{fullName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <RoleBadge role={user.role} />
              </div>
            </div>

            <div className="py-1">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Building2 className="size-3.5" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/auth/onboarding"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <UserCircle2 className="size-3.5" />
                <span>Profile & Identity</span>
              </Link>
            </div>

            <div className="border-t border-border/40 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
