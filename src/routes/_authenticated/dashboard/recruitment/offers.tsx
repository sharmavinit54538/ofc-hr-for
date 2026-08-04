import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListOffersQuery } from "@/services/recruitmentApi";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/offers")({
  component: RecruitmentOffersPage,
});

function RecruitmentOffersPage() {
  const { data, isLoading } = useListOffersQuery({ page: 1, page_size: 50 });

  const items = (data?.data?.items ?? []).map((offer) => ({
    id: offer.id,
    title: `${offer.candidate_name ?? "—"} - ${offer.job_title ?? "—"}`,
    subtitle: `Package: ${offer.salary ?? "—"} ${offer.currency ?? ""}`,
    status: offer.status,
    date: offer.expires_at ?? offer.signed_at ?? "—",
    metric: offer.esign_status,
  }));

  return (
    <GenericSubModuleView
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Offer Letters"
      description="Compensation approval workflow, offer letter dispatches, and e-signature status."
      items={items}
      isLoading={isLoading}
      showActions
    />
  );
}
