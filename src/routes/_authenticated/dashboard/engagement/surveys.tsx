import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { useGetEngagementSummaryQuery } from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/surveys")({
  component: EngagementSurveysPage,
});

function EngagementSurveysPage() {
  const { data: summaryRes } = useGetEngagementSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const enps = summaryRes?.data?.enps_score ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pulse Feedback & eNPS Surveys"
        description="Continuous workforce sentiment tracking and eNPS culture pulse."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Pulse Surveys" }]}
        backHref="/dashboard/engagement"
      />
      <div className="glass-tile rounded-2xl p-6 text-xs text-muted-foreground">
        Current eNPS Pulse Score: <strong className="text-foreground">+{enps}</strong> (Workforce Sentiment Score).
      </div>
    </div>
  );
}
