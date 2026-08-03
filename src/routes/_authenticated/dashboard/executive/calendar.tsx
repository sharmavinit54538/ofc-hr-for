import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Calendar as CalendarIcon, Building2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/executive/calendar")({
  component: ExecutiveCalendarPage,
});

function ExecutiveCalendarPage() {
  const user = useAuthStore((s) => s.user);
  const { data: employeesRes } = useListEmployeesQuery({ page: 1, page_size: 200 });
  const rawEmployees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const activeEmployees = useMemo(() => rawEmployees.filter((e) => e.status === "Active").length, [rawEmployees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Calendar & Governance Schedule"
        description="Schedule of board meetings, all-hands town halls, quarterly business reviews (QBRs), and leadership syncs."
        breadcrumbs={[{ label: "Executive", href: "/dashboard/executive" }, { label: "Calendar" }]}
        backHref="/dashboard/executive"
      />

      <div className="glass-tile rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <CalendarIcon className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Executive Office Operational Calendar</h3>
            <p className="text-xs text-muted-foreground">Connected to logged-in user: {user?.fullName || "Executive Leader"} ({user?.email})</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" /> Active Workspace Status
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Live
              </span>
            </div>
            <p className="text-muted-foreground">
              Managing {activeEmployees} active workforce members.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-purple-400" /> Security Clearances
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                Level 1
              </span>
            </div>
            <p className="text-muted-foreground">
              All executive syncs and governance events are encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
