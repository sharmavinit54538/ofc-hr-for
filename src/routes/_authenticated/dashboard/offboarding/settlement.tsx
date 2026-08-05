import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/offboarding/settlement")({
  component: FullAndFinalSettlementPage,
});

function FullAndFinalSettlementPage() {
  const rows = [
    { label: "Pending salary (last month)", amount: "—" },
    { label: "Leave encashment", amount: "—" },
    { label: "Bonus / incentive payout", amount: "—" },
    { label: "Deductions (loans, advances, notice buyout)", amount: "—" },
    { label: "Net settlement amount", amount: "—" },
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        title="Full & Final Settlement"
        description="Review and process final dues for employees who are exiting the organization."
        breadcrumbs={[{ label: "Offboarding", href: "/dashboard/offboarding" }, { label: "Settlement" }]}
      />
      <div className="glass-tile rounded-2xl p-5">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/40 last:border-0">
                <td className="py-3 text-muted-foreground">{row.label}</td>
                <td className="py-3 text-right font-semibold text-foreground">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
