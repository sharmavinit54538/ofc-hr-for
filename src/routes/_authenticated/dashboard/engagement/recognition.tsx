import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Loader2, Inbox } from "lucide-react";
import { useGetRecognitionsQuery } from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/recognition")({
  component: RecognitionWallPage,
});

function RecognitionWallPage() {
  const { data: recRes, isLoading } = useGetRecognitionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const recognitions = recRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Recognition Wall & Peer Shoutouts"
        description="Employee kudos feed, peer appreciation posts, and executive shoutouts."
        breadcrumbs={[{ label: "Employee Engagement", href: "/dashboard/engagement" }, { label: "Recognition Wall" }]}
        backHref="/dashboard/engagement"
      />

      {isLoading ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading recognition wall posts...
        </div>
      ) : recognitions.length === 0 ? (
        <div className="glass-tile rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground text-sm">No Recognition Posts Found</p>
          <p className="text-[11px] max-w-xs">
            There are currently no peer appreciation shoutouts posted.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recognitions.map((r) => (
            <div key={r.id} className="glass-tile space-y-2 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{r.senderName} ➔ {r.recipientName}</span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">🏆 {r.badge}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
