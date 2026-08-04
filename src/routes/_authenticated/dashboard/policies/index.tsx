import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Loader2,
  Inbox,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { useListPoliciesQuery, useCreatePolicyMutation } from "@/services/policyApi";

export const Route = createFileRoute("/_authenticated/dashboard/policies/")({
  component: PolicyCenterLandingPage,
});

function PolicyCenterLandingPage() {
  const policyNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "policies");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: policyRes, isLoading } = useListPoliciesQuery({ q: searchQuery }, {
    refetchOnMountOrArgChange: true,
  });

  const [createPolicy] = useCreatePolicyMutation();
  const policies = policyRes?.data ?? [];

  const handlePublishPolicy = async () => {
    try {
      await createPolicy({
        title: "New Corporate Policy Document",
        category: "HR",
        version: "v1.0",
        summary: "Official operational guidelines and workplace standards.",
      }).unwrap();
      toast.success("New Policy Published Successfully!");
    } catch {
      toast.error("Failed to publish policy.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Corporate Policy Center & Compliance Vault"
        description="Central repository for corporate HR handbooks, payroll tax policies, attendance rules, leave benefits, and SOC2 security mandates."
        breadcrumbs={[{ label: "Policy Center" }]}
        actions={
          <button
            onClick={handlePublishPolicy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Publish New Policy
          </button>
        }
      />

      {/* Policy List Grid */}
      <div className="space-y-4">
        <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies by title or category..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{policies.length} Published Policies</span>
        </div>

        {isLoading ? (
          <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading corporate policy vault...
          </div>
        ) : policies.length === 0 ? (
          <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Published Policies Found</p>
            <p className="text-[11px] max-w-xs">
              Click "Publish New Policy" above to upload your first company handbook or policy document.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {policies.map((pol) => (
              <div key={pol.id} className="glass-tile space-y-3 rounded-2xl p-5 transition-all hover-lift">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {pol.category} Policy
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{pol.version}</span>
                </div>

                <h3 className="font-display text-base font-bold text-foreground">{pol.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pol.summary}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground">Effective: <strong className="text-foreground">{pol.effectiveDate}</strong></span>
                  <span className="font-semibold text-emerald-400">Read Acknowledgment: {pol.acknowledgementPct}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sub-Modules */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Policy Categories</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {policyNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
