import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Handshake,
  FileLock,
  Receipt,
  BarChart3,
  Search,
  Plus,
  Star,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_VENDORS } from "@/lib/vendors/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/")({
  component: VendorsLandingPage,
});

function VendorsLandingPage() {
  const vendorNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "vendors");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_VENDORS.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Third-Party Vendor & Procurement Management"
        description="Vendor directory, active procurement contracts, accounts payable invoices, and SLA performance tracking."
        breadcrumbs={[{ label: "Vendor Management" }]}
        actions={
          <button
            onClick={() => toast.success("New Vendor Onboarding Initiated")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Onboard New Vendor
          </button>
        }
      />

      {/* Directory Table */}
      <div className="space-y-4">
        <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor name, category, contact..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{filtered.length} Active Vendors</span>
        </div>

        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Vendor ID</th>
                  <th className="px-5 py-3.5 font-bold">Company Name</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">Contact Person</th>
                  <th className="px-5 py-3.5 font-bold">Annual Contract</th>
                  <th className="px-5 py-3.5 font-bold">SLA Rating</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{v.vendorId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{v.name}</td>
                    <td className="px-5 py-4 font-semibold text-muted-foreground">{v.category}</td>
                    <td className="px-5 py-4 text-muted-foreground">{v.contactPerson}</td>
                    <td className="px-5 py-4 font-mono font-bold text-foreground">{v.contractValue}</td>
                    <td className="px-5 py-4 font-bold text-amber-400 flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400" /> {v.slaRating} / 5.0
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="size-3" /> {v.contractStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sub-Modules */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Vendor Procurement Sub-Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vendorNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
