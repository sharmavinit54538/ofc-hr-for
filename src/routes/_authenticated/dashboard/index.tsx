import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Building2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetMeQuery } from "@/services/authApi";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: MainDashboardOverviewPage,
});

function MainDashboardOverviewPage() {
  const { user: storeUser, organization } = useAuthStore();
  const { data: meRes } = useGetMeQuery();
  const { data: employeesRes, isLoading: isLoadingEmployees } = useListEmployeesQuery({
    page: 1,
    page_size: 1,
  });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const meData = meRes?.data;
  const userName = storeUser?.fullName || meData?.full_name || storeUser?.email || meData?.email || "User";
  const orgName = organization?.name || "Enterprise HQ";

  const totalEmployeesCount = employeesRes?.data?.total ?? employeesRes?.data?.items?.length ?? 0;
  const totalDeptsCount = departmentsRes?.data?.length ?? 0;

  const stats = [
    {
      title: "Total Workforce",
      value: isLoadingEmployees ? "..." : String(totalEmployeesCount),
      change: isLoadingEmployees ? "Syncing API..." : "Live backend count",
      icon: Users,
      href: "/dashboard/workforce",
    },
    {
      title: "Active Departments",
      value: isLoadingDepts ? "..." : String(totalDeptsCount),
      change: isLoadingDepts ? "Syncing API..." : "Live backend count",
      icon: Building2,
      href: "/dashboard/workforce/departments",
    },
    {
      title: "Attendance Rate",
      value: "—",
      change: "Awaiting backend biometric logs",
      icon: CalendarCheck,
      href: "/dashboard/attendance",
    },
    {
      title: "Monthly Payroll",
      value: "—",
      change: "Awaiting payroll backend run",
      icon: CreditCard,
      href: "/dashboard/payroll",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title={`Welcome back, ${userName}`}
        description={`${orgName} overview. Monitor live metrics, launch modules, and view real-time workspace activity.`}
      />

      {/* ── Stats Grid ────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.href}
              className="glass-tile group rounded-2xl p-5 transition-all duration-300 hover-lift hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {stat.title}
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow group-hover:scale-110 transition-transform">
                  <Icon className="size-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-foreground">
                  {stat.value === "..." ? (
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {stat.change}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── All Modules Quick Grid ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Administration Modules
          </h2>
          <span className="text-xs text-muted-foreground">Standalone Modules</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SIDEBAR_NAV_ITEMS.filter((i) => i.id !== "dashboard").map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                className="glass-tile group flex flex-col justify-between rounded-xl p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground group-hover:bg-gradient-brand group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {item.subModules.length} Sub-modules
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>Explore</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── AI Telemetry Widget ────────────────────────────────── */}
      <div className="glass-tile flex flex-col items-start justify-between gap-4 rounded-2xl p-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
            <Sparkles className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-foreground">
              Autonomous AI Workforce Co-Pilot Active
            </h3>
            <p className="text-xs text-muted-foreground">
              Connected to workspace telemetry. Real-time API sync enabled.
            </p>
          </div>
        </div>
        <Link
          to="/dashboard/ai-workforce"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
        >
          View AI Telemetry <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

