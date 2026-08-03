import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ScrollText,
  ShieldCheck,
  DollarSign,
  Clock,
  CalendarCheck,
  Search,
  Download,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_POLICIES } from "@/lib/policies/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/policies/")({
  component: PolicyCenterLandingPage,
});

function PolicyCenterLandingPage() {
  const policyNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "policies");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_POLICIES.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Corporate Policy Center & Compliance Vault"
        description="Central repository for corporate HR handbooks, payroll tax policies, attendance rules, leave benefits, and SOC2 security mandates."
        breadcrumbs={[{ label: "Policy Center" }]}
      />

      {/* Grid */}
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
          <span className="text-xs font-semibold text-muted-foreground">{filtered.length} Published Policies</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((pol) => (
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
