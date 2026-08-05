import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/offboarding/checklist")({
  component: ExitChecklistPage,
});

function ExitChecklistPage() {
  const steps = [
    "Resignation letter received and acknowledged",
    "Notice period and last working day confirmed",
    "Knowledge transfer / handover completed",
    "Manager sign-off on pending deliverables",
    "IT access and system credentials revoked",
    "Company assets returned (laptop, ID card, access card)",
    "Exit interview scheduled and completed",
    "Full and final settlement processed",
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        title="Exit Checklist & Handover"
        description="Track each step of the employee exit process from resignation to final clearance."
        breadcrumbs={[{ label: "Offboarding", href: "/dashboard/offboarding" }, { label: "Checklist" }]}
      />
      <div className="glass-tile rounded-2xl p-5 space-y-3">
        {steps.map((step, i) => (
          <label key={i} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
            <input type="checkbox" className="size-4 rounded border-border" />
            {step}
          </label>
        ))}
      </div>
    </div>
  );
}
