import { createFileRoute } from "@tanstack/react-router";
import { Target, Award, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_TEAM_GOALS, MOCK_TEAM_MEMBERS } from "@/lib/manager/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/manager/performance")({
  component: ManagerPerformancePage,
});

function ManagerPerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Performance & Goal Tracking"
        description="Track OKRs, performance ratings, and 1-on-1 review feedback for your direct team."
        breadcrumbs={[{ label: "Manager", href: "/dashboard/manager" }, { label: "Performance" }]}
        backHref="/dashboard/manager"
        actions={
          <button
            onClick={() => toast.info("New Team OKR", { description: "Opening OKR creation form." })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Create Goal / OKR
          </button>
        }
      />

      {/* Team Performance Overview Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-display text-base font-bold text-foreground">Direct Team Ratings & 1-on-1 Reviews</h3>
        </div>
        {MOCK_TEAM_MEMBERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <Award className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Direct Team Reviews</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Performance reviews and ratings for direct reports will be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Employee</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Rating</th>
                  <th className="px-5 py-3.5 font-bold">Joined</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MOCK_TEAM_MEMBERS.map((m) => (
                  <tr key={m.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">{m.fullName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.jobTitle}</td>
                    <td className="px-5 py-4 font-bold text-emerald-500">{m.performanceRating}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.joiningDate}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toast.success(`Starting 1-on-1 review for ${m.fullName}`)}
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary"
                      >
                        Conduct Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OKRs List */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-foreground">Active Team Goals (OKRs)</h3>
        {MOCK_TEAM_GOALS.length === 0 ? (
          <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
            <Target className="size-10 text-muted-foreground/60" />
            <h3 className="font-display text-base font-bold text-foreground">No Active Goals / OKRs</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Click "+ Create Goal / OKR" above to assign performance goals to your team.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_TEAM_GOALS.map((goal) => (
              <div key={goal.id} className="glass-tile rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{goal.id}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    goal.status === "Ahead" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                    goal.status === "On Track" ? "bg-sky-500/10 text-sky-500 border border-sky-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}>
                    {goal.status}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-foreground">{goal.title}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Assignee: <strong className="text-foreground">{goal.assignee}</strong></span>
                  <span>Due: {goal.dueDate}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-brand" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
