import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { ClipboardCheck, DollarSign, RotateCcw, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/offboarding/")({
  component: OffboardingLandingPage,
});

const OFFBOARDING_MODULES = [
  {
    id: "checklist",
    title: "Exit Checklist & Handover",
    description: "Resignation workflow, notice period tracking, and knowledge handover tasks",
    href: "/dashboard/offboarding/checklist",
    icon: ClipboardCheck,
    stats: "Exit Workflow",
    statusBadge: "Active",
  },
  {
    id: "settlement",
    title: "Full & Final Settlement",
    description: "Final salary computation, dues clearance, and payout processing",
    href: "/dashboard/offboarding/settlement",
    icon: DollarSign,
    stats: "F&F Settlement",
    statusBadge: "Pending Review",
  },
  {
    id: "asset-return",
    title: "Asset Return",
    description: "Company laptop, ID card, and equipment return tracking",
    href: "/dashboard/assets/return",
    icon: RotateCcw,
    stats: "Asset Recovery",
    statusBadge: "Linked",
  },
  {
    id: "relieving-letter",
    title: "Relieving Letter & Certificates",
    description: "Experience letters, relieving certificates, and final documentation",
    href: "/dashboard/documents/certificates",
    icon: BadgeCheck,
    stats: "480 Issued",
    statusBadge: "Linked",
  },
];

function OffboardingLandingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Offboarding"
        description="Manage exit workflows, final settlements, asset recovery, and relieving documentation for departing employees."
        breadcrumbs={[{ label: "Offboarding" }]}
      />
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Offboarding Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {OFFBOARDING_MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
