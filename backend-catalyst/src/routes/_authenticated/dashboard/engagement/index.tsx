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
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_RECOGNITIONS, MOCK_REWARDS } from "@/lib/engagement/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/engagement/")({
  component: EmployeeEngagementLandingPage,
});

function EmployeeEngagementLandingPage() {
  const engagementNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "engagement");
  const [posts] = useState(MOCK_RECOGNITIONS);

  const kpiCards = [
    { title: "Kudos & Shoutouts", value: "180", sub: "Given this month", icon: HeartHandshake, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Points Given", value: "4,200", sub: "Redeemable points", icon: Gift, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Badges Awarded", value: "48", sub: "Tenure & Innovation", icon: Award, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Pulse eNPS Score", value: "+86", sub: "Top Decile Culture", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Team Events", value: "12", sub: "Scheduled H2", icon: PartyPopper, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Active Participation", value: "94.2%", sub: "Workforce Engagement", icon: Trophy, color: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Employee Engagement & Culture Recognition Center"
        description="Public recognition wall, peer rewards, achievement badges, pulse eNPS surveys, team events, and tenure celebrations."
        breadcrumbs={[{ label: "Employee Engagement" }]}
        actions={
          <button
            onClick={() => toast.success("Recognition Kudos Sent!")}
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

      {/* Recognition Wall Feed & Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wall Feed */}
        <div className="glass-tile space-y-4 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <HeartHandshake className="size-4 text-rose-500" /> Live Recognition Wall Feed
            </h3>
            <span className="text-xs text-muted-foreground">Updated real-time</span>
          </div>

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
        </div>

        {/* Engagement Leaderboard */}
        <div className="glass-tile space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Trophy className="size-4 text-amber-400" /> Culture Champions Leaderboard
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {MOCK_REWARDS.map((r, idx) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-3">
                <div className="flex items-center gap-3">
                  <span className={`font-display text-base font-bold ${idx === 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-foreground">{r.employeeName}</h4>
                    <p className="text-[10px] text-muted-foreground">{r.tier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{r.pointsBalance} Pts</div>
                  <div className="text-[10px] text-muted-foreground">{r.pointsEarnedYtd} YTD</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Modules */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Employee Engagement Sub-Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {engagementNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
