import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useGetRecruitmentDashboardQuery,
  useListCandidatesQuery,
  useExportRecruitmentReportMutation,
} from "@/services/recruitmentApi";
import { toast } from "sonner";
import {
  BarChart2,
  PieChart as PieChartIcon,
  Download,
  AlertTriangle,
  RefreshCw,
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/analytics")({
  component: RecruitmentAnalyticsPage,
});

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

function RecruitmentAnalyticsPage() {
  const { data: dashRes, isLoading, isError, refetch } = useGetRecruitmentDashboardQuery();
  const { data: candRes } = useListCandidatesQuery({ page: 1, page_size: 100 });
  const [exportReport, { isLoading: isExporting }] = useExportRecruitmentReportMutation();

  const stats = dashRes?.data;
  const candidates = candRes?.data?.items ?? [];

  // Compute funnel breakdown dynamically from live PostgreSQL candidate statuses
  const stageCounts = {
    Applied: candidates.filter((c) => c.status === "APPLIED").length,
    Screening: candidates.filter((c) => c.status === "SCREENING").length,
    Interview: candidates.filter((c) => c.status === "INTERVIEW").length,
    Offer: candidates.filter((c) => c.status === "OFFER").length,
    Hired: candidates.filter((c) => c.status === "HIRED").length,
  };

  const funnelData = Object.entries(stageCounts).map(([stage, count]) => ({ stage, count }));

  const handleExport = async () => {
    try {
      const blob = await exportReport({ format: "csv" }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recruitment_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Recruitment analytics report exported.");
    } catch {
      toast.error("Failed to export report.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Analytics & Funnel Reports"
        description="Pipeline conversion metrics, stage dropoff rates, applicant volume, and hiring velocity."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Analytics" },
        ]}
        actions={
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            <Download className="size-4" /> {isExporting ? "Exporting..." : "Export Full Report"}
          </button>
        }
      />

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-tile h-64 animate-pulse rounded-2xl p-5" />
          <div className="glass-tile h-64 animate-pulse rounded-2xl p-5" />
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load recruitment analytics
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching funnel data from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Active Jobs</span>
                <Briefcase className="size-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.total_active_jobs ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Open requisitions</p>
            </div>

            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Applicants</span>
                <Users className="size-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.total_candidates ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">In active pipeline</p>
            </div>

            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Offers Sent</span>
                <FileCheck className="size-4 text-violet-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.total_offers_extended ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Offer stage</p>
            </div>

            <div className="glass-tile rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Hires</span>
                <TrendingUp className="size-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-foreground">
                {stats?.hires_this_month ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Successfully onboarded</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-tile rounded-2xl p-6 border border-border">
              <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <BarChart2 className="size-4 text-primary" /> Candidate Stage Pipeline Funnel
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Real-time applicant distribution across pipeline stages in PostgreSQL.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="stage" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-tile rounded-2xl p-6 border border-border">
              <h3 className="font-display text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <PieChartIcon className="size-4 text-primary" /> Pipeline Proportions
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Percentage share of candidates by pipeline phase.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={funnelData}
                      dataKey="count"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ stage, count }) => `${stage}: ${count}`}
                    >
                      {funnelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
