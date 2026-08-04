import { memo } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  PanelLeft,
  X,
  LayoutDashboard,
  Users,
  Lock,
  ShieldCheck,
  KeyRound,
  Globe,
  ClipboardList,
  Plug,
  Sliders,
  Radio,
  Activity,
  Database,
  BarChart3,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/auth/logo";
import { useAuthStore } from "@/hooks/useAuthStore";
import { cn } from "@/lib/utils";

const IT_ADMIN_NAV = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, href: "/dashboard/it-admin" },
  { id: "users", title: "User Management", icon: Users, href: "/dashboard/it-admin/users" },
  { id: "roles", title: "Roles & Permissions", icon: Lock, href: "/dashboard/it-admin/roles" },
  { id: "security", title: "Security Center", icon: ShieldCheck, href: "/dashboard/it-admin/security" },
  { id: "auth", title: "Authentication", icon: KeyRound, href: "/dashboard/it-admin/auth" },
  { id: "sso-mfa", title: "SSO & MFA", icon: Globe, href: "/dashboard/it-admin/sso-mfa" },
  { id: "audit", title: "Audit Logs", icon: ClipboardList, href: "/dashboard/it-admin/audit" },
  { id: "integrations", title: "Integrations", icon: Plug, href: "/dashboard/it-admin/integrations" },
  { id: "system-settings", title: "System Settings", icon: Sliders, href: "/dashboard/it-admin/system-settings" },
  { id: "api", title: "API Management", icon: Radio, href: "/dashboard/it-admin/api" },
  { id: "health", title: "System Health", icon: Activity, href: "/dashboard/it-admin/health" },
  { id: "backup", title: "Backup & Recovery", icon: Database, href: "/dashboard/it-admin/backup" },
  { id: "reports", title: "Reports", icon: BarChart3, href: "/dashboard/it-admin/reports" },
  { id: "settings", title: "Settings", icon: Settings, href: "/dashboard/it-admin/settings" },
] as const;

export const ItAdminSidebar = memo(function ItAdminSidebar({
  onClose,
  onToggleSidebar,
  collapsed = false,
  isMobile = false,
}: {
  onClose?: () => void;
  onToggleSidebar?: () => void;
  collapsed?: boolean;
  isMobile?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    void navigate({ to: "/auth/login", replace: true });
  };

  return (
    <aside
      aria-label="IT Admin Navigation"
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-border/30 bg-card/85 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        isMobile ? "w-72" : "hidden lg:flex",
      )}
    >
      {/* ── Brand Header ────────────────────────────────────────── */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        {!collapsed ? (
          <Logo />
        ) : (
          <Logo variant="iconOnly" className="mx-auto" />
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleSidebar ?? onClose}
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PanelLeft className="size-4" />
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation sidebar"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation Links ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3">
        <nav className="space-y-0.5">
          {IT_ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/it-admin"
                ? pathname === "/dashboard/it-admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                to={item.href as any}
                onClick={onClose}
                title={collapsed ? item.title : undefined}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive
                    ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                  )}
                  aria-hidden="true"
                />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Footer User Card & Sign out ───────────────────────────── */}
      <div className="shrink-0 p-3">
        <div
          className={cn(
            "glass-tile flex items-center justify-between gap-3 rounded-xl p-2.5",
            collapsed && "flex-col p-2",
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand font-display text-xs font-bold text-primary-foreground shadow-glow">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "I"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold leading-tight text-foreground">
                  {user?.fullName ?? "IT Admin"}
                </p>
                <p className="truncate text-[11px] font-medium text-muted-foreground/90 mt-0.5">
                  {user?.jobTitle ?? "IT Administrator"}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
});
