import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Users,
  ShieldCheck,
  Globe,
  Radio,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  MOCK_SYSTEM_HEALTH,
  MOCK_SSO_PROVIDERS,
  MOCK_BACKUP_SNAPSHOTS,
} from "@/lib/it-admin/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/")({
  component: ItAdminDashboardHome,
});

function ItAdminDashboardHome() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      {/* ── IT Admin Welcome Header ─────────────────────────────── */}
      <div className="glass-tile relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl leading-snug py-0.5">
              Welcome back, {user?.fullName ?? "IT Administrator"}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              {user?.jobTitle ?? "Head of IT & Identity"} · Information Technology & Cyber Security
            </p>
          </div>
          <Link
            to={"/dashboard/it-admin/health" as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Activity className="size-4" /> System Health Status
          </Link>
        </div>
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-gradient-brand opacity-5 blur-3xl" />
      </div>

      {/* ── System Telemetry KPI Cards ────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Core System Uptime</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.uptime}</div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">All clusters operational</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active User Sessions</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.activeSessions}</div>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">100% MFA Enforced</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">API Response Latency</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Radio className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.apiLatency}</div>
            <p className="mt-0.5 text-[10px] font-medium text-sky-500">P99 SLA met</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Threats Blocked Today</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{MOCK_SYSTEM_HEALTH.blockedThreatsToday}</div>
            <p className="mt-0.5 text-[10px] font-medium text-purple-400">Zero-Trust Guard active</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* SSO Identity Providers */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" /> Single Sign-On (SSO) Identity Providers
              </h3>
              <Link to={"/dashboard/it-admin/sso-mfa" as any} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Manage SSO <ArrowRight className="size-3" />
              </Link>
            </div>
            {MOCK_SSO_PROVIDERS.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                <Globe className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-medium text-foreground">No SSO Providers Configured</p>
                <p className="text-[11px]">Configure SAML 2.0 or OIDC integration in SSO Management.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_SSO_PROVIDERS.map((sso) => (
                  <div key={sso.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                        <Globe className="size-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{sso.name}</p>
                        <p className="text-[10px] text-muted-foreground">{sso.protocol} · {sso.usersCount} Assigned Users</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                      <CheckCircle2 className="size-3" /> {sso.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Recent DB Backups */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <Database className="size-4 text-emerald-500" /> Database Backup Snapshots
            </h3>
            {MOCK_BACKUP_SNAPSHOTS.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                <Database className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-medium text-foreground">No Snapshots Found</p>
                <p className="text-[11px]">Trigger a snapshot in Backup & Recovery.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_BACKUP_SNAPSHOTS.map((bk) => (
                  <div key={bk.id} className="rounded-xl border border-border/50 bg-card/40 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary">{bk.size}</span>
                      <span className="text-[10px] text-emerald-500 font-bold">{bk.status}</span>
                    </div>
                    <p className="font-mono text-[11px] text-foreground truncate">{bk.snapshotName}</p>
                    <p className="text-[10px] text-muted-foreground">{bk.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
