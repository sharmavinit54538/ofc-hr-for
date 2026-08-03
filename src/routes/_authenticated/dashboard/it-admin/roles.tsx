import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Lock, Shield, CheckCircle2, Users, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ROLE_DEFINITIONS } from "@/lib/auth/roles";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/roles")({
  component: ItAdminRolesPage,
});

function ItAdminRolesPage() {
  const { data: employeesRes, isLoading } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const rolesList = Object.values(ROLE_DEFINITIONS);

  const roleCounts = useMemo(() => {
    const counts: Record<string, { total: number; active: number }> = {};
    rolesList.forEach((r) => {
      counts[r.role] = { total: 0, active: 0 };
    });

    rawEmployees.forEach((emp) => {
      const r = emp.role || "EMPLOYEE";
      if (!counts[r]) {
        counts[r] = { total: 0, active: 0 };
      }
      counts[r].total += 1;
      if (emp.status === "Active") {
        counts[r].active += 1;
      }
    });

    return counts;
  }, [rawEmployees, rolesList]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access Control Matrix"
        description="Configure Role-Based Access Control (RBAC) permission matrices and view real-time user assignments from backend database."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Roles & Permissions" }]}
        backHref="/dashboard/it-admin"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rolesList.map((r) => {
            const stats = roleCounts[r.role] || { total: 0, active: 0 };
            return (
              <div key={r.role} className="glass-tile rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                      <Shield className="size-3.5" /> {r.role}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                      <Users className="size-3" /> {stats.total} User(s) Assigned
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-foreground">{r.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Default Portal: <strong className="text-foreground">{r.landing}</strong></span>
                    <span className="text-emerald-400 font-semibold">{stats.active} Active Member(s)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.permissions.map((p) => (
                      <span key={p} className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[9px] font-mono font-semibold text-foreground">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
