import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";
import { useListOffersQuery } from "@/services/recruitmentApi";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/offers")({
  component: RecruitmentOffersPage,
});

function RecruitmentOffersPage() {
  const { data, isLoading } = useListOffersQuery({ page: 1, page_size: 50 });

  const rawItems = (data?.data?.items ?? []).map((offer: any) => {
    const candName = offer.candidate_name || offer.candidate || "Candidate";
    const jobTitle = offer.job_title || offer.position || "Position Requisition";
    const packageText = offer.salary ? `$${Number(offer.salary).toLocaleString()} ${offer.currency ?? "USD"}` : "Competitive Package";
    const status = offer.status || "DRAFT";

    let dateStr = "Pending Dispatch";
    const rawDate = offer.expires_at || offer.signed_at || offer.created_at;
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
      } catch {
        dateStr = String(rawDate);
      }
    }

    const esign = offer.esign_status || (status === "APPROVED" || status === "SIGNED" ? "Signed" : "Pending E-Sign");

    return {
      id: offer.id || String(Math.random()),
      title: `${candName} - ${jobTitle}`,
      subtitle: `Compensation Package: ${packageText}`,
      status: String(status).toUpperCase(),
      date: dateStr,
      metric: esign,
    };
  });

  return (
    <GenericSubModuleView
      parentHref="/dashboard/recruitment"
      parentLabel="Recruitment"
      title="Offer Letters"
      description="Compensation approval workflow, offer letter dispatches, and e-signature status."
      items={rawItems}
      headers={{
        title: "Candidate & Position",
        subtitle: "Compensation Offer Details",
        status: "Offer Status",
        date: "Dispatch / Expiry Date",
        metric: "E-Signature Status",
      }}
      isLoading={isLoading}
      showActions
    />
  );
}
