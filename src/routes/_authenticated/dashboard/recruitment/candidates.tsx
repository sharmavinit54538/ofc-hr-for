import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListCandidatesQuery } from "@/services/recruitmentApi";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/candidates")({
  component: RecruitmentCandidatesPage,
});

function RecruitmentCandidatesPage() {
  const { data, isLoading } = useListCandidatesQuery({ page: 1, page_size: 50 });

  const items = (data?.data?.items ?? []).map((candidate) => ({
    id: candidate.id,
    title: candidate.full_name,
    subtitle: `Applied for ${candidate.job_title ?? "—"}`,
    status: candidate.stage,
    date: candidate.applied_at ? `Applied ${candidate.applied_at}` : "—",
    metric: candidate.screening_score ? `Score: ${candidate.screening_score}/100` : undefined,
  }));

  return (
    <GenericSubModuleView
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Candidates"
      description="Talent pool database, candidate stage tracking, and screening scorecards."
      items={items}
      isLoading={isLoading}
      showActions
    />
  );
}
