import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/vendors/performance")({
  component: VendorPerformancePage,
});

function VendorPerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor SLA Performance & Quality Ratings"
        description="Delivery speed, hardware SLA compliance rates, and supplier quality scorecards."
        breadcrumbs={[{ label: "Vendor Management", href: "/dashboard/vendors" }, { label: "Vendor Performance" }]}
        backHref="/dashboard/vendors"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">98.4% Average Vendor SLA Compliance Score across all suppliers.</div>
    </div>
  );
}
