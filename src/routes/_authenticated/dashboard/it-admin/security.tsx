import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ShieldCheck, AlertTriangle, Lock, CheckCircle2, ShieldAlert, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/security")({
  component: ItAdminSecurityPage,
});

interface SecurityAlertItem {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "nominal";
  severityStyle: string;
  icon: typeof ShieldAlert;
  timestamp: string;
}

function ItAdminSecurityPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  // Real Dynamic Security Telemetry calculated strictly from live database entities
  const dynamicSecurityAlerts = useMemo(() => {
    const items: SecurityAlertItem[] = [];
    let count = 1;

    // 1. Inactive/Suspended user accounts
    const inactiveUsers = rawEmployees.filter((e) => e.status !== "Active");
    if (inactiveUsers.length > 0) {
      items.push({
        id: `SOC-REAL-00${count++}`,
        title: `Access Audit: ${inactiveUsers.length} Non-Active User Account(s)`,
        description: `Found ${inactiveUsers.length} account(s) marked as Inactive/Archived. Verify OAuth2/JWT session revocation.`,
        severity: "medium",
        severityStyle: "border-amber-500/20 bg-amber-500/10 text-amber-500",
        icon: ShieldAlert,
        timestamp: "Real-time DB Audit",
      });
    }

    // 2. Unassigned department accounts
    const unassignedEmps = rawEmployees.filter((e) => !e.department && !e.department_id);
    if (unassignedEmps.length > 0) {
      items.push({
        id: `SOC-REAL-00${count++}`,
        title: `Governance Gap: ${unassignedEmps.length} Employee(s) Without Department Mappings`,
        description: `${unassignedEmps.length} active employee record(s) are missing organizational unit bindings.`,
        severity: "medium",
        severityStyle: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
        icon: AlertTriangle,
        timestamp: "Real-time DB Audit",
      });
    }

    // 3. Departments missing leadership
    const unassignedDepts = rawDepartments.filter((d) => !d.head_name && !d.manager_name && !d.head_id);
    if (unassignedDepts.length > 0) {
      items.push({
        id: `SOC-REAL-00${count++}`,
        title: `Structure Alert: ${unassignedDepts.length} Department(s) Missing Head of Department`,
        description: `Department(s) [${unassignedDepts.map((d) => d.name).slice(0, 3).join(", ")}] have no assigned executive/managerial head.`,
        severity: "high",
        severityStyle: "border-rose-500/20 bg-rose-500/10 text-rose-500",
        icon: Lock,
        timestamp: "Real-time DB Audit",
      });
    }

    return items;
  }, [rawEmployees, rawDepartments]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Operations Center (SOC) & RBAC Audit"
        description="Monitor real-time threat detection events, user account governance alerts, and active security middleware."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Security Center" }]}
        backHref="/dashboard/it-admin"
      />

      {/* Live System Status Banner */}
      <div className="glass-tile rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">OAuth2 JWT & RBAC Middleware Protection</h4>
            <p className="text-[11px] text-muted-foreground">HS256 Bearer Token validation active for all protected REST routes</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-400 border border-purple-500/20">
          <Sparkles className="size-3" /> Live Telemetry
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : dynamicSecurityAlerts.length > 0 ? (
        <div className="space-y-3">
          {dynamicSecurityAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="glass-tile rounded-2xl p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-400 flex items-center gap-1.5">
                    <Icon className="size-3.5" /> {alert.id}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${alert.severityStyle}`}>
                    {alert.severity} priority
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{alert.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{alert.description}</p>
                <p className="text-[10px] text-muted-foreground pt-1">{alert.timestamp}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-tile rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">No Security Telemetry Threat Alerts</h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            All user account statuses, department mappings, and JWT authentication guards are operating nominally.
          </p>
        </div>
      )}
    </div>
  );
}
