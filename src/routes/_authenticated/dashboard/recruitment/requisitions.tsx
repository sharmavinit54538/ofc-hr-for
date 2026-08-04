import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListJobOpeningsQuery,
  useCreateJobOpeningMutation,
} from "@/services/recruitmentApi";
import { toast } from "sonner";
import {
  Plus,
  Inbox,
  AlertTriangle,
  RefreshCw,
  FileText,
  DollarSign,
  Building2,
  Users,
} from "lucide-react";

import type { Job } from "@/types/recruitment";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/requisitions")({
  component: RecruitmentRequisitionsPage,
});

function RecruitmentRequisitionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Product Engineering");
  const [salaryRange, setSalaryRange] = useState("$120k - $150k");
  const [location, setLocation] = useState("Remote");

  const { data, isLoading, isError, refetch } = useListJobOpeningsQuery({ page: 1, page_size: 20 });
  const [createJob, { isLoading: isCreating }] = useCreateJobOpeningMutation();

  const requisitions = data?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !department) {
      toast.error("Please fill in requisition title and department.");
      return;
    }

    try {
      await createJob({
        title,
        department,
        salary_range: salaryRange,
        location,
      }).unwrap();

      toast.success("Headcount requisition submitted for approval.");
      setIsCreateOpen(false);
      setTitle("");
    } catch {
      toast.error("Failed to submit requisition.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Headcount Requisitions & Budget Approvals"
        description="Submit hiring requests, allocate salary budgets, and manage hiring manager approval chains."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Requisitions" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Request Headcount
          </button>
        }
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load headcount requisitions
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching requisitions from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : requisitions.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No headcount requisitions
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No headcount requisitions found in PostgreSQL. Create your first request.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Request Headcount
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requisitions.map((req: Job) => (
            <div
              key={req.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Building2 className="size-3" /> {req.department}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                    {req.status}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {req.title}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <DollarSign className="size-3 text-emerald-500" /> Budget Band:{" "}
                    <span className="text-foreground font-semibold">{req.salary_range || "Market Standard"}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Users className="size-3" /> Applicants in Pipeline: {req.applicants_count}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground flex justify-between">
                <span>Location: {req.location}</span>
                <span>Type: {req.employment_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Requisition Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Request Headcount Requisition
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Requisition Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Engineer"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Approved Salary Band
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g. $120k - $150k"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Location / Work Mode
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
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
                  {isCreating ? "Submitting..." : "Submit Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
