import { createFileRoute } from "@tanstack/react-router";
import { Users, Mail, MapPin, Search, Plus, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/manager/team")({
  component: ManagerTeamPage,
});

function ManagerTeamPage() {
  const { data: employeesRes, isLoading } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const [searchQuery, setSearchQuery] = useState("");

  const employees = useMemo(() => employeesRes?.data?.items ?? [], [employeesRes]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.job_title && m.job_title.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q)),
    );
  }, [employees, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Direct Team"
        description="View employee records, performance ratings, and contact info for all team members reporting to you."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "My Team" }]}
        backHref="/dashboard/manager"
        actions={
          <button
            onClick={() => toast.info("Request Team Expansion", { description: "Opening requisition form for new headcount." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Request Headcount
          </button>
        }
      />

      {/* Toolbar */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search direct reports by name, email, or role..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{filtered.length} Direct Reports</span>
      </div>

      {/* Team Cards Grid */}
      {isLoading ? (
        <div className="glass-tile flex items-center justify-center p-12 rounded-2xl text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="ml-2.5 text-xs font-semibold">Loading Team Members...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Users className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Direct Team Members Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Add team members or employees in the Workforce section to assign direct reports.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div key={m.id} className="glass-tile rounded-2xl p-5 space-y-4 transition-all hover-lift">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground shadow-glow">
                    {m.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{m.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{m.job_title || m.department || "Employee"}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    m.is_active
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {m.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 rounded-xl border border-border/50 bg-card/40 p-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="size-3 text-primary" /> Email</span>
                  <span className="font-semibold text-foreground truncate max-w-[160px]">{m.email}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="size-3 text-primary" /> Department</span>
                  <span className="font-semibold text-foreground">{m.department || "General"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
