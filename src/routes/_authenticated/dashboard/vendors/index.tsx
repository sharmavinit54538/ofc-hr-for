import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Plus,
  Star,
  CheckCircle2,
  Loader2,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { useListVendorsQuery, useCreateVendorMutation } from "@/services/vendorApi";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/")({
  component: VendorsLandingPage,
});

function VendorsLandingPage() {
  const vendorNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "vendors");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vendorRes, isLoading } = useListVendorsQuery(searchQuery, {
    refetchOnMountOrArgChange: true,
  });

  const [createVendor] = useCreateVendorMutation();
  const vendors = vendorRes?.data ?? [];

  const handleOnboardVendor = async () => {
    try {
      await createVendor({
        name: "New Enterprise Vendor",
        category: "IT Hardware",
        contactPerson: "Account Manager",
        email: "contact@vendor.com",
        phone: "+1 800 555 0199",
        contractValue: "$100,000 / Yr",
      }).unwrap();
      toast.success("New Vendor Onboarded Successfully!");
    } catch {
      toast.error("Failed to onboard vendor.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Third-Party Vendor & Procurement Management"
        description="Vendor directory, active procurement contracts, accounts payable invoices, and SLA performance tracking."
        breadcrumbs={[{ label: "Vendor Management" }]}
        actions={
          <button
            onClick={handleOnboardVendor}
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
          <span className="text-xs font-semibold text-muted-foreground">{vendors.length} Active Vendors</span>
        </div>

        {isLoading ? (
          <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading vendor directory...
          </div>
        ) : vendors.length === 0 ? (
          <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Approved Vendors Found</p>
            <p className="text-[11px] max-w-xs">
              Click "Onboard New Vendor" above to register your first third-party vendor.
            </p>
          </div>
        ) : (
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
                  {vendors.map((v) => (
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
        )}
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
