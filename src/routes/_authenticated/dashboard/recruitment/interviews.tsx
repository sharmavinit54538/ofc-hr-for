import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListInterviewsQuery } from "@/services/recruitmentApi";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/interviews")({
  component: RecruitmentInterviewsPage,
});

function RecruitmentInterviewsPage() {
  const { data, isLoading } = useListInterviewsQuery({ page: 1, page_size: 50 });

  const rawItems = (data?.data?.items ?? []).map((interview: any) => {
    const round = interview.round || interview.interview_type || "Technical Round";
    const candidate = interview.candidate_name || interview.candidate || "Candidate Applicant";
    const interviewer = interview.interviewer_name || interview.interviewer || "Hiring Panel";
    const status = interview.status || "Scheduled";
    const mode = interview.mode || "Video Call";

    let dateStr = mode;
    if (interview.scheduled_at) {
      try {
        const d = new Date(interview.scheduled_at);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
      } catch {
        dateStr = String(interview.scheduled_at);
      }
    }

    const outcome = interview.outcome || (interview.score ? `Score: ${interview.score}/100` : "Pending Evaluation");

    return {
      id: interview.id || String(Math.random()),
      title: round,
      subtitle: `Candidate: ${candidate} · Panel: ${interviewer}`,
      status: String(status).toUpperCase(),
      date: dateStr,
      metric: outcome,
    };
  });

  return (
    <GenericSubModuleView
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Interviews"
      description="Scheduled interview rounds, candidate panel evaluations, and interview feedback."
      items={rawItems}
      headers={{
        title: "Interview Round",
        subtitle: "Candidate & Panel Info",
        status: "Stage / Status",
        date: "Scheduled Date / Mode",
        metric: "Outcome / Score",
      }}
      isLoading={isLoading}
      showActions
    />
  );
}
