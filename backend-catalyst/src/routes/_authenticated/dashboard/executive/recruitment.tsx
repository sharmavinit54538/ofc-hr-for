import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Users, Crown, Building2, Loader2, Mail, ShieldCheck, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery, useListDepartmentsQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/recruitment")({
  component: ExecutiveRecruitmentPage,
});

function ExecutiveRecruitmentPage() {
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const { data: departmentsRes, isLoading: isLoadingDepts } = useListDepartmentsQuery();

  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);
  const rawDepartments = useMemo(() => departmentsRes?.data ?? [], [departmentsRes]);

  const isLoading = isLoadingEmps || isLoadingDepts;

  // Filter executive leadership team
  const leadershipMembers = useMemo(() => {
    return rawEmployees.filter(
      (e) => e.role === "EXECUTIVE" || e.role === "MANAGER" || (e.job_title && e.job_title.toLowerCase().includes("chief"))
    );
  }, [rawEmployees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Recruitment & Leadership Governance"
        description="Monitor C-suite leadership roles, management allocations, and organizational talent pipeline."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Recruitment & Leadership" }]}
        backHref="/dashboard/executive"
      />

      {/* ── Macro Leadership KPI Grid ─────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Executive Board Members</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Crown className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : leadershipMembers.length}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">Active Executive & Managerial Roles</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Departments</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : rawDepartments.length}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Active Business Divisions</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workforce Capacity</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">
              {isLoading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : rawEmployees.length}
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">Total Registered Employees</p>
          </div>
        </div>
      </div>

      {/* ── Active Executive & Manager Leadership Directory ──────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Crown className="size-4 text-purple-400" /> Active Executive & Management Leadership ({leadershipMembers.length})
          </h3>
          <Link
            to={"/dashboard/workforce/executives" as any}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Provision Executive →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : leadershipMembers.length === 0 ? (
          <div className="p-8 text-center">
            <Crown className="mx-auto size-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">No Executive Members Found</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add executives under Workforce Management to assign strategic leadership positions.
            </p>
            <Link
              to={"/dashboard/workforce/executives" as any}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow"
            >
              Provision Executive Role
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {leadershipMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between text-xs transition-colors hover:bg-secondary/40">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-bold font-display text-sm">
                    {member.full_name?.charAt(0) || "E"}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      {member.full_name}
                      <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold text-purple-400">
                        {member.role}
                      </span>
                    </h4>
                    <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-2">
                      <span>{member.job_title || "Executive Role"}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Mail className="size-3" /> {member.email}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="size-3.5" /> {member.department || "Corporate Office"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
