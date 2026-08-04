import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListJobsQuery } from "@/services/recruitmentApi";
import { CreateJobDialog } from "@/components/recruitment/create-job-dialog";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/jobs")({
  component: RecruitmentJobsPage,
});

function RecruitmentJobsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data, isLoading } = useListJobsQuery({ page: 1, page_size: 50 });

  const items = (data?.data?.items ?? []).map((job) => ({
    id: job.id,
    title: job.title,
    subtitle: `${job.department ?? "—"} · ${job.employment_type ?? "—"}`,
    status: `${job.applicant_count ?? 0} Applicants`,
    date: job.posted_at ? `Posted ${job.posted_at}` : "—",
    metric: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : undefined,
  }));

  return (
    <>
      <GenericSubModuleView
        parentHref="/dashboard/recruitment"
        parentLabel="Recruitment"
        title="Job Requisitions"
        description="Active job openings, applicant pipelines, and hiring manager assignments."
        items={items}
        isLoading={isLoading}
        showActions
        onCreate={() => setIsCreateOpen(true)}
      />
      <CreateJobDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
