import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import {
  useGetRecruitmentReportQuery,
  useListJobsQuery,
  useListCandidatesQuery,
  useListInterviewsQuery,
  useListOffersQuery,
} from "@/services/recruitmentApi";
import {
  Briefcase,
  Users,
  Calendar,
  FileCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/")({
  component: RecruitmentLandingPage,
});

function RecruitmentLandingPage() {
  const recruitmentNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "recruitment");
  const { data: reportRes, isLoading, isError, refetch } = useGetRecruitmentReportQuery();

  const { data: jobsData } = useListJobsQuery({ page: 1, page_size: 1 });
  const { data: candidatesData } = useListCandidatesQuery({ page: 1, page_size: 1 });
  const { data: interviewsData } = useListInterviewsQuery({ page: 1, page_size: 1 });
  const { data: offersData } = useListOffersQuery({ page: 1, page_size: 1 });

  const report = reportRes?.data;

  const jobsCount = jobsData?.data?.total ?? report?.open_requisitions ?? 0;
  const candidatesCount = candidatesData?.data?.total ?? report?.total_applicants ?? 0;
  const interviewsCount = interviewsData?.data?.total ?? report?.interviews_conducted ?? 0;
  const offersCount = offersData?.data?.total ?? report?.offers_accepted ?? 0;

  const subModules = (recruitmentNav?.subModules ?? []).map((sub) => {
    switch (sub.id) {
      case "jobs":
        return { ...sub, stats: `${jobsCount} Open Roles` };
      case "candidates":
        return { ...sub, stats: `${candidatesCount} Applicants` };
      case "interviews":
        return { ...sub, stats: `${interviewsCount} Scheduled` };
      case "offers":
        return { ...sub, stats: `${offersCount} Offers` };
      default:
        return sub;
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recruitment & Talent Acquisition"
        description="End-to-end applicant tracking system, job requisitions, candidate evaluation pipelines, and offer approvals."
        breadcrumbs={[{ label: "Recruitment" }]}
      />

      {/* ── Summary Stat Cards ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-tile h-28 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            Failed to load recruitment stats from backend.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Active Job Openings</span>
              <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                <Briefcase className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {jobsCount}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Open requisitions in pipeline</p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Applicants</span>
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Users className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {candidatesCount}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Candidates in database</p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Interviews Scheduled</span>
              <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <Calendar className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {interviewsCount}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Upcoming interview rounds</p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Offers Extended</span>
              <div className="grid size-9 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
                <FileCheck className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {offersCount}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Active offer letters
            </p>
          </div>
        </div>
      )}

      {/* ── Submodules Grid ── */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Recruitment Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
