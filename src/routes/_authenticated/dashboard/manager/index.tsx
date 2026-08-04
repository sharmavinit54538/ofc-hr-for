import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Clock,
  Palmtree,
  Target,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { useListGoalsQuery } from "@/services/performanceApi";

export interface TeamLeaveApproval {
  id: string;
  employeeName: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedDate: string;
}

export const Route = createFileRoute("/_authenticated/dashboard/manager/")({
  component: ManagerDashboardHome,
});

function ManagerDashboardHome() {
  const user = useAuthStore((s) => s.user);
  const { data: employeesRes, isLoading: isLoadingEmps } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const { data: goalsRes } = useListGoalsQuery();
  const goals = goalsRes?.data?.items ?? [];
  const [leaves, setLeaves] = useState<TeamLeaveApproval[]>([]);

  const pendingLeaves = useMemo(() => leaves.filter((l) => l.status === "Pending"), [leaves]);

  const teamMembers = useMemo(() => {
    const items = employeesRes?.data?.items ?? [];
    return items;
  }, [employeesRes]);

  const handleApprove = (id: string, name: string) => {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Approved" } : l)));
    toast.success("Leave Approved", { description: `Approved leave request for ${name}.` });
  };

  const handleReject = (id: string, name: string) => {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Rejected" } : l)));
    toast.info("Leave Rejected", { description: `Rejected leave request for ${name}.` });
  };

  return (
    <div className="space-y-6">
      {/* ── Welcome Header ────────────────────────────────────────── */}
      <div className="glass-tile relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl leading-snug py-0.5">
              Welcome back, {user?.fullName ?? "Manager"}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed sm:text-sm">
              {user?.jobTitle ?? "Manager"} · {teamMembers.length} Direct Reports / Team Members
            </p>
          </div>
          <Link
            to={"/dashboard/manager/team" as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Users className="size-4" /> View My Team
          </Link>
        </div>
        <div className="absolute -right-20 -top-20 size-60 rounded-full bg-gradient-brand opacity-5 blur-3xl" />
      </div>

      {/* ── Quick KPI Stat Cards ───────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Direct Reports</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{teamMembers.length}</div>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">
              {teamMembers.filter((m) => m.status === "Active").length} Active Members
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending Approvals</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Palmtree className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">{pendingLeaves.length}</div>
            <p className="mt-0.5 text-[10px] font-medium text-amber-500">
              {pendingLeaves.length > 0 ? "Action required" : "No pending requests"}
            </p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Team Goal Completion</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Target className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">0%</div>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">No active goals</p>
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-4 transition-all hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Team Attendance Rate</span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl font-bold text-foreground">100%</div>
            <p className="mt-0.5 text-[10px] font-medium text-sky-500">Current Cycle</p>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Grid ───────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pending Approvals */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Palmtree className="size-4 text-amber-500" /> Pending Team Approvals
              </h3>
              <Link to={"/dashboard/manager/leave" as any} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="size-3" />
              </Link>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <CheckCircle2 className="size-8 text-emerald-500/60 mx-auto" />
                <p className="font-medium text-foreground">All team requests cleared!</p>
                <p className="text-[11px] text-muted-foreground">No pending leave requests requiring approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{leave.employeeName} <span className="font-mono text-[11px] text-muted-foreground">({leave.employeeId})</span></p>
                      <p className="text-muted-foreground mt-0.5">{leave.type} · {leave.days} day(s) · {leave.from} to {leave.to}</p>
                      <p className="text-[11px] text-muted-foreground/80 italic mt-1 font-sans">"{leave.reason}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReject(leave.id, leave.employeeName)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(leave.id, leave.employeeName)}
                        className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 shadow-glow transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Goals Progress */}
          <div className="glass-tile rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Target className="size-4 text-emerald-500" /> Team Goals & OKRs
              </h3>
              <Link to={"/dashboard/manager/performance" as any} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View Performance <ArrowRight className="size-3" />
              </Link>
            </div>
            {goals.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <Target className="size-8 text-muted-foreground/40 mx-auto" />
                <p className="font-medium text-foreground">No Team Goals Configured</p>
                <p className="text-[11px] text-muted-foreground">Go to Performance to set OKRs for direct reports.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="rounded-xl border border-border/50 bg-card/40 p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground">{goal.title}</p>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        {goal.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Type: <strong className="text-foreground">{goal.goal_type}</strong></span>
                      <span>Target: {goal.target_date || "—"}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-brand" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Direct Reports Directory Preview */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="size-4 text-primary" /> Direct Reports ({teamMembers.length})
            </h3>
            {isLoadingEmps ? (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="ml-2 text-xs">Loading team members...</span>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <Users className="size-8 text-muted-foreground/40 mx-auto" />
                <p className="font-medium text-foreground">No Direct Reports Found</p>
                <p className="text-[11px]">Add employees in Workforce to assign team members.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand font-bold text-primary-foreground">
                        {member.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{member.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.job_title || member.department || "Employee"}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                      {member.status === "Active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Onboarding Progress Widget */}
          <div className="glass-tile rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-purple-500" /> New Hire Onboarding
            </h3>
            <div className="py-6 text-center text-xs text-muted-foreground">
              No active new hire onboarding pipelines.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
