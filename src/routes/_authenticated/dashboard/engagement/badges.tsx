import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetBadgesQuery } from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/badges")({
  component: BadgesPage,
});

function BadgesPage() {
  const { data: badgesRes, isLoading } = useGetBadgesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const badges = badgesRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gamified Achievement Badges"
        description="Earn digital badges for leadership, innovation, teamwork, and tenure milestones."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Badges" }]}
        backHref="/dashboard/engagement"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading achievement badges...
        </div>
      ) : badges.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Achievement Badges Found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {badges.map((b) => (
            <div key={b.name} className="glass-tile flex items-center gap-4 rounded-2xl p-5">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
