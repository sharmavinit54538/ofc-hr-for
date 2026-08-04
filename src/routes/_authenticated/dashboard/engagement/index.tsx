import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake,
  Gift,
  Award,
  MessageSquare,
  PartyPopper,
  ThumbsUp,
  Sparkles,
  Trophy,
  Loader2,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  useGetEngagementSummaryQuery,
  useGetRecognitionsQuery,
  useCreateRecognitionMutation,
} from "@/services/engagementApi";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/")({
  component: EmployeeEngagementLandingPage,
});

function EmployeeEngagementLandingPage() {
  const { data: summaryRes } = useGetEngagementSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: recRes, isLoading: isLoadingRec } = useGetRecognitionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createRecognition] = useCreateRecognitionMutation();

  const summary = summaryRes?.data;
  const posts = recRes?.data ?? [];

  const handleSendKudos = async () => {
    try {
      await createRecognition({
        recipientName: "Team Member",
        badge: "Innovation Star",
        message: "Outstanding dedication and teamwork!",
      }).unwrap();
      toast.success("Recognition Kudos Sent!");
    } catch {
      toast.error("Failed to send kudos.");
    }
  };

  const kpiCards = [
    { title: "Kudos & Shoutouts", value: (summary?.kudos_count ?? posts.length).toString(), sub: "Given this month", icon: HeartHandshake, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Points Given", value: (summary?.points_given ?? 0).toString(), sub: "Redeemable points", icon: Gift, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Badges Awarded", value: (summary?.badges_awarded ?? 0).toString(), sub: "Tenure & Innovation", icon: Award, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Pulse eNPS Score", value: (summary?.enps_score ? `+${summary.enps_score}` : "0").toString(), sub: "Culture Pulse", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Team Events", value: (summary?.team_events_count ?? 0).toString(), sub: "Scheduled Events", icon: PartyPopper, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Active Participation", value: `${summary?.active_participation_pct ?? 0}%`, sub: "Workforce Engagement", icon: Trophy, color: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Engagement & Culture Recognition Center"
        description="Public recognition wall, peer rewards, achievement badges, pulse eNPS surveys, team events, and tenure celebrations."
        breadcrumbs={[{ label: "Employee Engagement" }]}
        actions={
          <button
            onClick={handleSendKudos}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Sparkles className="size-4" /> Send Kudos Shoutout
          </button>
        }
      />

      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recognition Wall Feed */}
      <div className="glass-tile space-y-4 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <HeartHandshake className="size-4 text-rose-500" /> Live Recognition Wall Feed
          </h3>
          <span className="text-xs text-muted-foreground">Updated real-time</span>
        </div>

        {isLoadingRec ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            Loading recognition posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Recognition Shoutouts Found</p>
            <p className="text-[11px] max-w-xs">
              Click "Send Kudos Shoutout" above to post the first peer appreciation message.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-border/50 bg-card/40 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-primary-foreground">
                      {post.senderName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-foreground">{post.senderName}</span>
                      <span className="text-muted-foreground"> recognized </span>
                      <span className="font-bold text-primary">{post.recipientName}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                    🏆 {post.badge}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed pl-9">{post.message}</p>

                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px] pl-9">
                  <button onClick={() => toast.success("Liked Shoutout!")} className="text-muted-foreground hover:text-rose-400 inline-flex items-center gap-1">
                    <ThumbsUp className="size-3 text-rose-400" /> {post.kudosCount} Kudos
                  </button>
                  <span className="text-muted-foreground">{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
