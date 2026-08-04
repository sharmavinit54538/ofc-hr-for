import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListGoalsQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} from "@/services/performanceApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Target,
  Trash2,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { GoalStatus, GoalType } from "@/types/performance";

export const Route = createFileRoute("/_authenticated/dashboard/performance/goals")({
  component: PerformanceGoalsPage,
});

function PerformanceGoalsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("INDIVIDUAL");
  const [targetDate, setTargetDate] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [progress, setProgress] = useState(0);

  // API Hooks
  const { data, isLoading, isError, refetch } = useListGoalsQuery({
    page,
    page_size: 15,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: employeesData } = useListEmployeesQuery();
  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal] = useUpdateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();

  const goals = data?.data?.items ?? [];
  const totalPages = data?.data?.total_pages ?? 1;
  const employees = employeesData?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide a goal title.");
      return;
    }

    try {
      await createGoal({
        title,
        description,
        goal_type: goalType,
        target_date: targetDate || undefined,
        employee_id: selectedEmployeeId || undefined,
        progress,
        status: progress >= 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED",
      }).unwrap();

      toast.success("Goal created successfully.");
      setIsCreateOpen(false);
      setTitle("");
      setDescription("");
      setProgress(0);
    } catch {
      toast.error("Failed to create goal.");
    }
  };

  const handleProgressChange = async (id: string, newProgress: number) => {
    const newStatus: GoalStatus = newProgress >= 100 ? "COMPLETED" : newProgress > 0 ? "IN_PROGRESS" : "NOT_STARTED";
    try {
      await updateGoal({ id, body: { progress: newProgress, status: newStatus } }).unwrap();
      toast.success("Goal progress updated.");
    } catch {
      toast.error("Failed to update goal progress.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(id).unwrap();
      toast.success("Goal deleted.");
    } catch {
      toast.error("Failed to delete goal.");
    }
  };

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Completed</span>;
      case "IN_PROGRESS":
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">In Progress</span>;
      case "CANCELLED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Cancelled</span>;
      default:
        return <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">Not Started</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goal Tracking & OKRs"
        description="Company strategy alignment, key result indicators, and team targets."
        breadcrumbs={[
          { label: "Performance", href: "/dashboard/performance" },
          { label: "Goals" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Create Goal
          </button>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search goals by title or description..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-40 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load performance goals
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching goals from backend.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No goals found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No goals or OKRs exist in PostgreSQL for your selected criteria.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Create Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                    <Target className="size-3" /> {g.goal_type}
                  </span>
                  {getStatusBadge(g.status)}
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {g.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {g.description || "No description provided."}
                </p>

                {g.employee_name && (
                  <p className="mt-2 text-[11px] font-semibold text-foreground/80">
                    Owner: {g.employee_name}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1">
                  <span>Progress</span>
                  <span className="text-primary font-bold">{g.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={(e) => handleProgressChange(g.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Target: {g.target_date || "No deadline"}</span>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="p-1 hover:text-destructive transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Goal Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Create Goal / OKR
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Launch AI Feature"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Goal Type
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as GoalType)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="INDIVIDUAL">Individual Goal</option>
                  <option value="TEAM">Team Goal</option>
                  <option value="DEPARTMENT">Department Goal</option>
                  <option value="COMPANY">Company OKR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Assignee (Optional)
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Self / Me</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details and key metrics..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Creating..." : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
