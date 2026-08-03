import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const vouchers = [
    { id: "v1", title: "Amazon $50 E-Gift Card", cost: "500 Pts" },
    { id: "v2", title: "Starbucks Coffee & Snacks Pass", cost: "200 Pts" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redeemable Peer Reward Points & Vouchers"
        description="Redeem earned kudos points for gift vouchers, tech perks, and performance bonuses."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Rewards" }]}
        backHref="/dashboard/engagement"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {vouchers.map((v) => (
          <div key={v.id} className="glass-tile space-y-2 rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-foreground">{v.title}</h3>
            <p className="text-xs font-bold text-primary">Cost: {v.cost}</p>
            <button onClick={() => toast.success(`Redeemed ${v.title}`)} className="glass-tile w-full rounded-xl py-2 text-xs font-semibold hover:bg-secondary mt-2">
              Redeem Voucher
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
