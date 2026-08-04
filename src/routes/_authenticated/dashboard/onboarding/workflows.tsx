import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListOnboardingWorkflowsQuery,
  useCreateOnboardingWorkflowMutation,
  useDeleteOnboardingWorkflowMutation,
} from "@/services/authApi";
import { toast } from "sonner";
import {
  Workflow,
  Plus,
  Trash2,
  Zap,
  CheckCircle2,
  Building2,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/workflows")({
  component: OnboardingWorkflowsPage,
});

function OnboardingWorkflowsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Product Engineering");
  const [totalSteps, setTotalSteps] = useState(6);
  const [autoTrigger, setAutoTrigger] = useState("On Offer Acceptance");
  const [description, setDescription] = useState("");

  // API Hooks
  const { data: workflowsRes, isLoading, isError, refetch } = useListOnboardingWorkflowsQuery();
  const [createWorkflow, { isLoading: isCreating }] = useCreateOnboardingWorkflowMutation();
  const [deleteWorkflow] = useDeleteOnboardingWorkflowMutation();

  const workflows = workflowsRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a workflow playbook title.");
      return;
    }

    try {
      await createWorkflow({
        title,
        department,
        total_steps: totalSteps,
        auto_trigger: autoTrigger,
        description: description || undefined,
      }).unwrap();

      toast.success("Onboarding workflow created successfully.");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
    } catch {
      toast.error("Failed to create onboarding workflow.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this onboarding workflow?")) return;
    try {
      await deleteWorkflow(id).unwrap();
      toast.success("Onboarding workflow deleted.");
    } catch {
      toast.error("Failed to delete onboarding workflow.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Onboarding Workflows"
        description="Pre-configured orientation playbooks, IT provisioning automation, hardware dispatches, and department welcome sequences stored in PostgreSQL."
        breadcrumbs={[
          { label: "Onboarding", href: "/dashboard/onboarding" },
          { label: "Automated Workflows" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Create Onboarding Workflow
          </button>
        }
      />

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
            Failed to load onboarding playbooks
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching automated workflows from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : workflows.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No onboarding workflows configured
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No automated onboarding sequences found. Click below to create one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Create Onboarding Workflow
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="size-3" /> Active Sequence
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <Layers className="size-3" /> {wf.total_steps} Auto-Steps
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {wf.title}
                </h3>
                {wf.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {wf.description}
                  </p>
                )}

                <div className="mt-4 rounded-xl bg-secondary/50 p-2.5 border border-border/50 text-xs text-muted-foreground space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3 text-blue-500" /> Target Department:
                    </span>
                    <span className="font-bold text-foreground">{wf.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Zap className="size-3 text-amber-500" /> Auto-Trigger Rule:
                    </span>
                    <span className="font-bold text-foreground">{wf.auto_trigger}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-500 text-[11px] flex items-center gap-1">
                  <Workflow className="size-3.5" /> PostgreSQL Workflow
                </span>

                <button
                  onClick={() => handleDelete(wf.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Workflow"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Onboarding Workflow Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Create Onboarding Workflow
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Playbook Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Engineering Orientation & IT Setup"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Target Department</label>
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
                    <option value="All Departments">All Departments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Total Auto-Steps</label>
                  <input
                    type="number"
                    min={1}
                    value={totalSteps}
                    onChange={(e) => setTotalSteps(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Auto-Trigger Condition</label>
                <select
                  value={autoTrigger}
                  onChange={(e) => setAutoTrigger(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="On Offer Acceptance">On Offer Acceptance</option>
                  <option value="On Contract Signoff">On Contract Signoff</option>
                  <option value="On First Day (Clock-in)">On First Day (Clock-in)</option>
                  <option value="Manual HR Dispatch">Manual HR Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Playbook Description & Automation Steps</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="GitHub invite, AWS role creation, Jira access, hardware dispatch..."
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
                  {isCreating ? "Saving..." : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
