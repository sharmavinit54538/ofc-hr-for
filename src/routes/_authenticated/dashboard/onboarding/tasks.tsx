import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListOnboardingTasksQuery,
  useCreateOnboardingTaskMutation,
  useUpdateOnboardingTaskStatusMutation,
  useDeleteOnboardingTaskMutation,
} from "@/services/authApi";
import { toast } from "sonner";
import {
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Filter,
  Search,
  Truck,
  User,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/tasks")({
  component: OnboardingTasksPage,
});

function OnboardingTasksPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("IT Admin (Priya N.)");
  const [candidateName, setCandidateName] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [trackingInfo, setTrackingInfo] = useState("");

  // API Hooks
  const queryArgs: { status?: string; search?: string } = {};
  if (statusFilter) queryArgs.status = statusFilter;
  if (search) queryArgs.search = search;

  const { data: tasksRes, isLoading, isError, refetch } = useListOnboardingTasksQuery(
    Object.keys(queryArgs).length > 0 ? queryArgs : undefined
  );
  const [createTask, { isLoading: isCreating }] = useCreateOnboardingTaskMutation();
  const [updateTaskStatus] = useUpdateOnboardingTaskStatusMutation();
  const [deleteTask] = useDeleteOnboardingTaskMutation();

  const tasks = tasksRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !candidateName) {
      toast.error("Please enter task title and candidate name.");
      return;
    }

    try {
      await createTask({
        task_title: taskTitle,
        assigned_to: assignedTo,
        candidate_name: candidateName,
        priority,
        due_date: dueDate,
        tracking_info: trackingInfo || undefined,
      }).unwrap();

      toast.success("Onboarding task created successfully.");
      setIsModalOpen(false);
      setTaskTitle("");
      setCandidateName("");
      setTrackingInfo("");
    } catch {
      toast.error("Failed to create task.");
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus.toUpperCase() === "COMPLETED" ? "In Progress" : "Completed";
    try {
      await updateTaskStatus({
        id,
        body: { status: nextStatus },
      }).unwrap();
      toast.success(`Task marked as ${nextStatus.toLowerCase()}.`);
    } catch {
      toast.error("Failed to update task status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this onboarding task?")) return;
    try {
      await deleteTask(id).unwrap();
      toast.success("Onboarding task deleted.");
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p.toUpperCase()) {
      case "HIGH":
        return <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-500">HIGH</span>;
      case "MEDIUM":
        return <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500">MEDIUM</span>;
      default:
        return <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Completed</span>;
      case "PENDING":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Pending</span>;
      default:
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">In Progress</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Checklists & IT Dispatch"
        description="Workstation hardware dispatch, RFID keycard security access, and software license provisioning checklist stored in PostgreSQL."
        breadcrumbs={[
          { label: "Onboarding", href: "/dashboard/onboarding" },
          { label: "Task Checklists" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Onboarding Task
          </button>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, task title, or assigned owner..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" /> Filter Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
          >
            <option value="">All Tasks</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* ── Content Area / Table ── */}
      {isLoading ? (
        <div className="glass-tile h-64 animate-pulse rounded-2xl p-6" />
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load onboarding checklist tasks
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching tasks from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No onboarding tasks found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No active tasks match your search or filter. Click below to add one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Add Onboarding Task
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card/80 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Task Title & Candidate</th>
                  <th className="p-3.5">Assigned Owner</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Due Date & Dispatch Info</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-card/40 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckSquare className="size-4 text-primary shrink-0" /> {task.task_title}
                      </div>
                      <div className="text-[11px] text-muted-foreground pl-5.5">
                        Candidate: <span className="font-medium text-foreground">{task.candidate_name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <User className="size-3 text-blue-500" /> {task.assigned_to}
                      </span>
                    </td>
                    <td className="p-3.5">{getPriorityBadge(task.priority)}</td>
                    <td className="p-3.5 font-mono text-muted-foreground">
                      <div>{task.due_date}</div>
                      {task.tracking_info && (
                        <div className="text-[10px] text-emerald-500 font-sans flex items-center gap-1">
                          <Truck className="size-3" /> {task.tracking_info}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">{getStatusBadge(task.status)}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleComplete(task.id, task.status)}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                          title="Toggle Completion"
                        >
                          <CheckCircle2 className="size-3" />
                          {task.status.toUpperCase() === "COMPLETED" ? "Reopen" : "Done"}
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add Onboarding Task Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Add Onboarding Task & IT Dispatch
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Task Title / Item</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Dispatch MacBook Pro 16” M3"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Arjun Gupta"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Assigned Owner</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="IT Admin (Priya N.)">IT Admin (Priya N.)</option>
                    <option value="Facilities Team">Facilities Team</option>
                    <option value="DevOps Team">DevOps Team</option>
                    <option value="HR Operations">HR Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Dispatch / Tracking Info</label>
                  <input
                    type="text"
                    value={trackingInfo}
                    onChange={(e) => setTrackingInfo(e.target.value)}
                    placeholder="e.g. FedEx #94018274"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Saving..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
