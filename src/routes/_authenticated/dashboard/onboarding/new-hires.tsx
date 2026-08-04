import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListNewHiresQuery,
  useCreateNewHireMutation,
  useUpdateNewHireStatusMutation,
  useDeleteNewHireMutation,
} from "@/services/authApi";
import { toast } from "sonner";
import {
  UserPlus,
  Plus,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Search,
  Laptop,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/new-hires")({
  component: IncomingNewHiresPage,
});

function IncomingNewHiresPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Product Engineering");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [buddyName, setBuddyName] = useState("");

  // API Hooks
  const queryArgs: { search?: string } = {};
  if (search) queryArgs.search = search;

  const { data: hiresRes, isLoading, isError, refetch } = useListNewHiresQuery(
    Object.keys(queryArgs).length > 0 ? queryArgs : undefined
  );
  const [createNewHire, { isLoading: isCreating }] = useCreateNewHireMutation();
  const [updateStatus] = useUpdateNewHireStatusMutation();
  const [deleteNewHire] = useDeleteNewHireMutation();

  const hires = hiresRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !roleTitle) {
      toast.error("Please fill in candidate name, email, and role.");
      return;
    }

    try {
      await createNewHire({
        name,
        email,
        role_title: roleTitle,
        department,
        start_date: startDate,
        buddy_name: buddyName || undefined,
      }).unwrap();

      toast.success("New hire registered successfully.");
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setRoleTitle("");
      setBuddyName("");
    } catch {
      toast.error("Failed to register new hire.");
    }
  };

  const handleAdvanceProgress = async (id: string, currentProgress: number, currentStatus: string) => {
    const nextProgress = Math.min(100, currentProgress + 20);
    let nextStatus = currentStatus;
    if (nextProgress >= 100) nextStatus = "Orientation Complete";
    else if (nextProgress >= 80) nextStatus = "Laptop Dispatched";
    else if (nextProgress >= 50) nextStatus = "Docs Verified";

    try {
      await updateStatus({
        id,
        body: { progress_percent: nextProgress, status: nextStatus },
      }).unwrap();
      toast.success(`Updated onboarding progress to ${nextProgress}%.`);
    } catch {
      toast.error("Failed to update progress.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate tracker?")) return;
    try {
      await deleteNewHire(id).unwrap();
      toast.success("New hire record deleted.");
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming New Hires Tracker"
        description="Monitor joining dates, orientation milestone completion, hardware dispatch telemetry, and assigned onboarding buddies."
        breadcrumbs={[
          { label: "Onboarding", href: "/dashboard/onboarding" },
          { label: "Incoming New Hires" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Register New Hire
          </button>
        }
      />

      {/* ── Search Bar ── */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate by name, email, or role..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-48 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load incoming new hires
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching new hire records from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : hires.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No incoming new hires found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No candidates matching your criteria. Click below to register one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Register New Hire
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hires.map((hire) => (
            <div
              key={hire.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 border border-blue-500/20">
                    <Laptop className="size-3" /> {hire.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Calendar className="size-3" /> Start: {hire.start_date}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {hire.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {hire.role_title} · <span className="text-foreground font-medium">{hire.department}</span>
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <TrendingUp className="size-3 text-emerald-500" /> Orientation Progress:
                    </span>
                    <span className="font-bold text-foreground">{hire.progress_percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-gradient-brand transition-all duration-500"
                      style={{ width: `${hire.progress_percent}%` }}
                    />
                  </div>
                </div>

                {hire.buddy_name && (
                  <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                    <UserCheck className="size-3.5 text-primary shrink-0" /> Buddy: <span className="font-bold text-foreground">{hire.buddy_name}</span>
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                {hire.progress_percent < 100 ? (
                  <button
                    onClick={() => handleAdvanceProgress(hire.id, hire.progress_percent, hire.status)}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/20"
                  >
                    +20% Advance Step
                  </button>
                ) : (
                  <span className="font-bold text-emerald-500 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Fully Onboarded
                  </span>
                )}

                <button
                  onClick={() => handleDelete(hire.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Candidate Record"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Register New Hire Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Register Incoming New Hire
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Gupta"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arjun.gupta@company.com"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Lead Engineer"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="Product Engineering">Product Engineering</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Joining / Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Assigned Buddy (Optional)</label>
                  <input
                    type="text"
                    value={buddyName}
                    onChange={(e) => setBuddyName(e.target.value)}
                    placeholder="e.g. Vinit Sharma"
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
                  {isCreating ? "Saving..." : "Register Hire"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
