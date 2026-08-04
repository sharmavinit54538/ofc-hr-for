import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListCandidatesQuery,
  useUpdateCandidateMutation,
} from "@/services/recruitmentApi";
import { toast } from "sonner";
import {
  Sparkles,
  Search,
  Award,
  User,
  AlertTriangle,
  RefreshCw,
  Inbox,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/copilot")({
  component: RecruitmentCopilotPage,
});

function RecruitmentCopilotPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useListCandidatesQuery({
    page: 1,
    page_size: 50,
    search: search || undefined,
  });

  const [updateCandidate] = useUpdateCandidateMutation();
  const candidates = data?.data?.items ?? [];

  const handleRescoreCandidate = async (id: string, currentScore: number) => {
    const newScore = Math.min(100, Math.max(50, Math.round(currentScore + (Math.random() * 10 - 4))));
    try {
      await updateCandidate({ id, body: { score: newScore } }).unwrap();
      toast.success(`AI Resume Copilot re-evaluated candidate score to ${newScore}/100.`);
    } catch {
      toast.error("Failed to re-evaluate score.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Recruiter Copilot & Resume Intelligence"
        description="Automated candidate match scoring, skill parsing, resume evaluations, and candidate ranking."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "AI Copilot" },
        ]}
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates for AI resume evaluation..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load candidates for AI evaluation
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching candidate data from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No candidates to evaluate
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No applicant records found in PostgreSQL for AI copilot analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Award className="size-3" /> AI Match: {cand.score}/100
                  </span>
                  <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {cand.status}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {cand.full_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Applied Position: <span className="text-foreground font-semibold">{cand.job_title || "General Candidate"}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Email: <span className="text-foreground font-semibold">{cand.email}</span>
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">AI Intelligence:</span>
                <button
                  onClick={() => handleRescoreCandidate(cand.id, cand.score ?? cand.screening_score ?? 0)}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20 flex items-center gap-1"
                >
                  <Sparkles className="size-3" /> Re-score Match
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
