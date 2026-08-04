import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useGetRewardsQuery } from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const { data: rewardsRes, isLoading } = useGetRewardsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const vouchers = rewardsRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Redeemable Peer Reward Points & Vouchers"
        description="Redeem earned kudos points for gift vouchers, tech perks, and performance bonuses."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Rewards" }]}
        backHref="/dashboard/engagement"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading reward vouchers...
        </div>
      ) : vouchers.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Reward Vouchers Available</p>
          <p className="text-[11px] max-w-xs">
            There are currently no active reward vouchers published.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
