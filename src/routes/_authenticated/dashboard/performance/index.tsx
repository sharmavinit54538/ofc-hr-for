import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { useGetPerformanceDashboardQuery } from "@/services/performanceApi";
import {
  Award,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/performance/")({
  component: PerformanceLandingPage,
});

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function PerformanceLandingPage() {
  const nav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "performance");
  const { data, isLoading, isError, refetch } = useGetPerformanceDashboardQuery();

  const stats = data?.data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Performance Management & OKRs"
        description="Goal tracking (OKRs), annual appraisal cycles, 360-degree feedback, and employee competency skill matrices."
        breadcrumbs={[{ label: "Performance" }]}
      />

      {/* ── High Level Stat Cards ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-tile h-28 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            Failed to load performance metrics from backend.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Reviews</span>
              <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {stats?.total_reviews ?? 0}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {stats?.completed_reviews ?? 0} completed · {stats?.pending_reviews ?? 0} pending
            </p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Average Rating</span>
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {stats?.average_rating ? `${stats.average_rating} / 5.0` : "N/A"}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Overall score: {stats?.overall_performance_score ?? 0}%
            </p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Goals Completed</span>
              <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <Target className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {stats?.goals_completed ?? 0} / {stats?.goals_total ?? 0}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {stats?.goals_in_progress ?? 0} in progress
            </p>
          </div>

          <div className="glass-tile rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Top Performers</span>
              <div className="grid size-9 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
                <Award className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-display text-foreground">
              {stats?.top_performers_count ?? 0}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {stats?.low_performers_count ?? 0} needing improvement
            </p>
          </div>
        </div>
      )}

      {/* ── Charts Section ── */}
      {stats && (stats.rating_distribution.length > 0 || stats.goal_completion.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Rating Distribution Bar Chart */}
          {stats.rating_distribution.length > 0 && (
            <div className="glass-tile rounded-2xl p-5 border border-border/60">
              <h3 className="text-sm font-bold font-display text-foreground mb-4">
                Rating Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.rating_distribution}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="rating_bucket" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Goal Completion Donut Chart */}
          {stats.goal_completion.length > 0 && (
            <div className="glass-tile rounded-2xl p-5 border border-border/60">
              <h3 className="text-sm font-bold font-display text-foreground mb-4">
                Goal Completion Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.goal_completion}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {stats.goal_completion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Submodules Navigation ── */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Performance Modules
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {nav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
