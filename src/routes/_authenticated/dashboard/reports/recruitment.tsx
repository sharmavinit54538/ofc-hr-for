import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { useGetRecruitmentReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/recruitment")({
  component: RecruitmentReportPage,
});

function RecruitmentReportPage() {
  const { data: recRes } = useGetRecruitmentReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const rec = recRes?.data;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Open Requisitions</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {rec?.open_requisitions ?? 0} Roles
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Requisitions</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Candidates</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {rec?.total_applicants ?? 0} Applicants
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Pipeline Applicants</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Interviews Conducted</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {rec?.interviews_conducted ?? 0} Sessions
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Assessment Telemetry</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Offers Accepted</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {rec?.offers_accepted ?? 0} Candidates
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Accepted Offers</p>
      </div>
    </>
  );

  const tableData = [
    {
      metric: "Active Open Job Requisitions",
      count: `${rec?.open_requisitions ?? 0} Active Requisitions`,
    },
    {
      metric: "Total Applicants in Talent Pipeline",
      count: `${rec?.total_applicants ?? 0} Candidates`,
    },
    {
      metric: "Interviews Conducted",
      count: `${rec?.interviews_conducted ?? 0} Sessions`,
    },
    {
      metric: "Offers Accepted by Candidates",
      count: `${rec?.offers_accepted ?? 0} Accepted`,
    },
  ];

  const columns = [
    { key: "metric", label: "Recruitment Pipeline Metric" },
    { key: "count", label: "Value" },
  ];

  return (
    <ReportViewLayout
      title="Recruitment Pipeline & Talent Acquisition Report"
      description="Applicant tracking metrics, candidate funnel conversion rates, offer acceptance velocity, and hiring source analysis."
      categoryBadge="Recruitment Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
