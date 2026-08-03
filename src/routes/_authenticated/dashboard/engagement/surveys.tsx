import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/surveys")({
  component: EngagementSurveysPage,
});

function EngagementSurveysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pulse Feedback & eNPS Surveys"
        description="Continuous workforce sentiment tracking and eNPS culture pulse."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Pulse Surveys" }]}
        backHref="/dashboard/engagement"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">Current eNPS Pulse Score: +86 (Top Decile Enterprise Culture).</div>
    </div>
  );
}
