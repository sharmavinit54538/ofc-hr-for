import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { toast } from "sonner";
import { Zap, Plus, CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/automation")({
  component: RecruitmentAutomationPage,
});

const DEFAULT_RULES = [
  {
    id: "rule-1",
    name: "Auto-Send Screening Email on Application",
    trigger: "New Candidate Applied",
    action: "Send Screening Assessment Link",
    status: "Active",
  },
  {
    id: "rule-2",
    name: "Auto-Move Candidate to Offer Stage on Approval",
    trigger: "Interview Score > 85",
    action: "Generate Offer Draft",
    status: "Active",
  },
  {
    id: "rule-3",
    name: "Notify Hiring Manager on Schedule",
    trigger: "Interview Round Scheduled",
    action: "Send Slack & Email Alert",
    status: "Active",
  },
];

function RecruitmentAutomationPage() {
  const [rules, setRules] = useState(DEFAULT_RULES);

  const toggleRuleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r
      )
    );
    toast.success("Automation rule status updated.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation & Workflow Rules"
        description="Configure automated stage advancement triggers, email auto-responders, and interview notifications."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Automation Rules" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="glass-tile flex flex-col justify-between rounded-2xl p-5 border border-border"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Zap className="size-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    rule.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {rule.status}
                </span>
              </div>

              <h3 className="mt-3 font-display text-base font-bold text-foreground">
                {rule.name}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>
                  Trigger: <span className="text-foreground font-semibold">{rule.trigger}</span>
                </p>
                <p>
                  Action: <span className="text-foreground font-semibold">{rule.action}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 flex justify-end">
              <button
                onClick={() => toggleRuleStatus(rule.id)}
                className="rounded-lg border border-input px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                {rule.status === "Active" ? "Pause Rule" : "Activate Rule"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
