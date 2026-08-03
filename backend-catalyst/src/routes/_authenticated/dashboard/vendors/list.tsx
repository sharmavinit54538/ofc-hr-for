import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_VENDORS } from "@/lib/vendors/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/list")({
  component: VendorListPage,
});

function VendorListPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Full Vendor Directory & Contact Registry"
        description="Comprehensive directory of approved hardware suppliers, cloud providers, and HR service vendors."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Directory" }]}
        backHref="/dashboard/vendors"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {MOCK_VENDORS.map((v) => (
          <div key={v.id} className="glass-tile space-y-2 rounded-2xl p-5">
            <span className="font-mono text-xs font-bold text-primary">{v.vendorId}</span>
            <h3 className="font-display text-base font-bold text-foreground">{v.name}</h3>
            <p className="text-xs text-muted-foreground">{v.contactPerson} ({v.phone})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
