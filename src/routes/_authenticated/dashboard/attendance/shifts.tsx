import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListShiftsQuery,
  useCreateShiftMutation,
  useDeleteShiftMutation,
} from "@/services/attendanceApi";
import { toast } from "sonner";
import {
  Clock,
  Plus,
  Trash2,
  Users,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Inbox,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/attendance/shifts")({
  component: AttendanceShiftsPage,
});

function AttendanceShiftsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [workingDays, setWorkingDays] = useState("Mon-Fri");
  const [graceMinutes, setGraceMinutes] = useState(15);
  const [description, setDescription] = useState("");

  // API Hooks
  const { data: shiftsRes, isLoading, isError, refetch } = useListShiftsQuery();
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

  const shifts = shiftsRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error("Please provide Shift Name and Code.");
      return;
    }

    try {
      await createShift({
        name,
        code,
        start_time: startTime,
        end_time: endTime,
        working_days: workingDays,
        grace_minutes: graceMinutes,
        description: description || undefined,
      }).unwrap();

      toast.success("Shift pattern created successfully.");
      setIsModalOpen(false);
      setName("");
      setCode("");
      setDescription("");
    } catch {
      toast.error("Failed to create shift pattern.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shift pattern?")) return;
    try {
      await deleteShift(id).unwrap();
      toast.success("Shift pattern deleted.");
    } catch {
      toast.error("Failed to delete shift pattern.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Patterns & Schedules"
        description="Rotational shift planning, timing schedules, grace periods, and employee rosters managed via PostgreSQL."
        breadcrumbs={[
          { label: "Attendance", href: "/dashboard/attendance" },
          { label: "Shift Patterns" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Create Shift Pattern
          </button>
        }
      />

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
            Failed to load shift patterns
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching shifts from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : shifts.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No shift patterns configured
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No shift rosters currently exist in PostgreSQL. Click below to add one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Create Shift Pattern
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                    <Zap className="size-3" /> Code: {shift.code}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Active Roster
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {shift.name}
                </h3>
                {shift.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {shift.description}
                  </p>
                )}

                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Clock className="size-3.5 text-blue-500" /> {shift.start_time} – {shift.end_time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-500" /> Days: <span className="text-foreground font-semibold">{shift.working_days}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    Grace Period: <span className="text-foreground font-semibold">{shift.grace_minutes} mins</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  <Users className="size-3.5 text-emerald-500" /> {shift.assigned_count} Staff Assigned
                </span>

                <button
                  onClick={() => handleDelete(shift.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Shift Pattern"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Shift Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Create Shift Pattern
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Shift Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. EMEA Support Shift"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Shift Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. S2"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="06:00 PM"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Working Days</label>
                  <input
                    type="text"
                    required
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="Mon-Fri"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Grace Period (Mins)</label>
                  <input
                    type="number"
                    required
                    value={graceMinutes}
                    onChange={(e) => setGraceMinutes(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details regarding shift roster, allowances, or timezone..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none resize-none"
                />
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
                  {isCreating ? "Saving..." : "Create Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
