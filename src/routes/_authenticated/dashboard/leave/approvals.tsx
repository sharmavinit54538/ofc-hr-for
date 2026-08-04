import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListLeaveApprovalRulesQuery,
  useCreateLeaveApprovalRuleMutation,
  useDeleteLeaveApprovalRuleMutation,
} from "@/services/leaveApi";
import { toast } from "sonner";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  GitMerge,
  Users,
  AlertTriangle,
  RefreshCw,
  Inbox,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/leave/approvals")({
  component: LeaveApprovalsPage,
});

function LeaveApprovalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [ruleName, setRuleName] = useState("");
  const [approvalLevels, setApprovalLevels] = useState(2);
  const [autoApproveDays, setAutoApproveDays] = useState(1);
  const [escalationHours, setEscalationHours] = useState(48);
  const [appliesTo, setAppliesTo] = useState("All Staff (Standard)");
  const [description, setDescription] = useState("");

  // API Hooks
  const { data: rulesRes, isLoading, isError, refetch } = useListLeaveApprovalRulesQuery();
  const [createRule, { isLoading: isCreating }] = useCreateLeaveApprovalRuleMutation();
  const [deleteRule] = useDeleteLeaveApprovalRuleMutation();

  const rules = rulesRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) {
      toast.error("Please enter a rule name.");
      return;
    }

    try {
      await createRule({
        rule_name: ruleName,
        approval_levels: approvalLevels,
        auto_approve_days: autoApproveDays,
        escalation_hours: escalationHours,
        applies_to: appliesTo,
        description: description || undefined,
      }).unwrap();

      toast.success("Leave approval rule created successfully.");
      setIsModalOpen(false);
      setRuleName("");
      setDescription("");
    } catch {
      toast.error("Failed to create approval rule.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this approval rule?")) return;
    try {
      await deleteRule(id).unwrap();
      toast.success("Approval rule deleted.");
    } catch {
      toast.error("Failed to delete approval rule.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Level Approval Rules"
        description="Manager escalation policies, auto-approval thresholds, delegation rules, and multi-tier signoff workflows stored in PostgreSQL."
        breadcrumbs={[
          { label: "Leave", href: "/dashboard/leave" },
          { label: "Approval Rules" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Create Approval Rule
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
            Failed to load approval rules
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching rules from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : rules.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No approval rules configured
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No active multi-level approval workflows found. Click below to create one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Create Approval Rule
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                    <ShieldCheck className="size-3" /> Enforced Policy
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    <GitMerge className="size-3" /> {rule.approval_levels}-Level Flow
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {rule.rule_name}
                </h3>
                {rule.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {rule.description}
                  </p>
                )}

                <div className="mt-4 rounded-xl bg-secondary/50 p-2.5 border border-border/50 text-xs text-muted-foreground space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-blue-500" /> Target Audience:
                    </span>
                    <span className="font-bold text-foreground">{rule.applies_to}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-amber-500" /> Escalation Timer:
                    </span>
                    <span className="font-bold text-foreground">{rule.escalation_hours} Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-500" /> Fast-Track Threshold:
                    </span>
                    <span className="font-bold text-foreground">
                      {rule.auto_approve_days > 0 ? `<= ${rule.auto_approve_days} Day(s)` : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-500 text-[11px]">
                  PostgreSQL Active Rule
                </span>

                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Rule"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Approval Rule Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Create Leave Approval Rule
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Standard 2-Level Corporate Flow"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Approval Levels</label>
                  <select
                    value={approvalLevels}
                    onChange={(e) => setApprovalLevels(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value={1}>1-Level (Direct Manager)</option>
                    <option value={2}>2-Level (Manager -&gt; HR)</option>
                    <option value={3}>3-Level (Manager -&gt; HR -&gt; VP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Escalation Timer</label>
                  <select
                    value={escalationHours}
                    onChange={(e) => setEscalationHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours (Standard)</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Auto-Approve Threshold</label>
                  <input
                    type="number"
                    min={0}
                    value={autoApproveDays}
                    onChange={(e) => setAutoApproveDays(Number(e.target.value))}
                    placeholder="Days (e.g. 1)"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={appliesTo}
                    onChange={(e) => setAppliesTo(e.target.value)}
                    placeholder="e.g. All Staff"
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Rule Description & Hierarchy</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Level 1: Direct Manager -> Level 2: HR Signoff..."
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
                  {isCreating ? "Saving..." : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
