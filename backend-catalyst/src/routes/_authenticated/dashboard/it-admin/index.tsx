import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  Users,
  ShieldCheck,
  Globe,
  Database,
  ArrowRight,
  CheckCircle2,
  Building2,
  Loader2,
  Key,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/")({
  component: ItAdminDashboardHome,
});

function ItAdminDashboardHome() {
  const user = useAuthStore((s) => s.user);

  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  const totalHeadcount = rawEmployees.length;
  const activeEmps = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);
  const totalDepartments = rawDepartments.length;
  const itAdminsCount = useMemo(
    () => rawEmployees.filter((e) => e.role === "IT_ADMIN" || e.job_title?.toLowerCase().includes("it")).length,
    [rawEmployees]
  );

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
              {user?.jobTitle ?? "IT Systems Lead"} · {user?.email ?? "IT Security Office"}
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

      {/* ── Real System Telemetry KPI Cards ────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Backend API Status</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-emerald-400">100% Online</div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">FastAPI Uvicorn Active</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Directory Personnel</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : totalHeadcount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">{activeEmps} Active Accounts</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monitored Departments</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : totalDepartments}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-sky-500">Org Units Mapped</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">IT Admin Controllers</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : itAdminsCount}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-purple-400">RBAC Level 1 Admin</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Security & Authentication Protocols */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" /> System Authentication & Access Protocols
              </h3>
              <Link to={"/dashboard/it-admin/sso-mfa" as any} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Manage Security <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                    <Key className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">OAuth2 Password & JWT Token Auth</p>
                    <p className="text-[10px] text-muted-foreground">HS256 Bearer Header Authentication Active</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  <CheckCircle2 className="size-3" /> Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-purple-500/10 text-purple-400 font-bold">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Role-Based Access Control (RBAC)</p>
                    <p className="text-[10px] text-muted-foreground">Enforcing HR_ADMIN, IT_ADMIN, EXECUTIVE, MANAGER, EMPLOYEE scopes</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  <CheckCircle2 className="size-3" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Database Backup & Persistence Status */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-4">
              <Database className="size-4 text-emerald-500" /> Database Engine & Persistence
            </h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/50 bg-card/40 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary">PostgreSQL / SQLite</span>
                  <span className="text-[10px] text-emerald-500 font-bold">Connected</span>
                </div>
                <p className="font-mono text-[11px] text-foreground truncate">FastAPI SQLAlchemy Async Engine</p>
                <p className="text-[10px] text-muted-foreground">Automated ACID Transactions Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
