import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, PanelLeft, Search, ShieldCheck } from "lucide-react";
import { ThemeSwitch } from "@/components/auth/theme-switch";
import { NotificationBell } from "@/components/common/notification-bell";
import { useAuthStore } from "@/hooks/useAuthStore";

export const AdminHeader = memo(function AdminHeader({
  onOpenSidebar,
  onToggleSidebar,
}: {
  onOpenSidebar?: () => void;
  onToggleSidebar?: () => void;
}) {
  const organization = useAuthStore((s) => s.organization);

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between bg-card/40 px-4 md:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          className="grid size-9 place-items-center rounded-xl border border-border bg-card/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Sidebar Collapse/Expand Toggle Button next to Search */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Toggle sidebar collapse"
          aria-label="Toggle sidebar collapse"
          className="hidden md:grid size-9 place-items-center rounded-xl border border-border bg-card/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
        >
          <PanelLeft className="size-4" />
        </button>

        {/* Search Input */}
        <div className="relative w-48 sm:w-64 md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="admin-global-search"
            type="text"
            placeholder="Search employees, modules, policies..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Organization pill */}
        <Link
          to="/dashboard/settings/organization"
          title="Click to edit Organization Profile & Company Name"
          className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/40 sm:flex"
        >
          <ShieldCheck className="size-3.5" />
          <span className="truncate max-w-[140px] md:max-w-none">
            {organization?.name ?? "Enterprise HQ"}
          </span>
        </Link>

        <NotificationBell />
        <ThemeSwitch />
      </div>
    </header>
  );
});
