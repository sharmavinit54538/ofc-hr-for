import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListInterviewsQuery } from "@/services/recruitmentApi";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/interviews")({
  component: RecruitmentInterviewsPage,
});

function RecruitmentInterviewsPage() {
  const { data, isLoading } = useListInterviewsQuery({ page: 1, page_size: 50 });

  const items = (data?.data?.items ?? []).map((interview) => ({
    id: interview.id,
    title: interview.round ?? "Interview",
    subtitle: `Candidate: ${interview.candidate_name ?? "—"} · Panel: ${interview.interviewer ?? "—"}`,
    status: interview.scheduled_at ?? interview.status,
    date: interview.mode ?? "—",
    metric: interview.outcome,
  }));

  return (
    <GenericSubModuleView
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Interviews"
      description="Scheduled interview rounds, candidate panel evaluations, and interview feedback."
      items={items}
      isLoading={isLoading}
      showActions
    />
  );
}
