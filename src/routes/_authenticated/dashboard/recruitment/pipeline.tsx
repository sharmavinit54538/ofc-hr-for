import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListCandidatesQuery,
  useUpdateCandidateMutation,
  useListJobOpeningsQuery,
} from "@/services/recruitmentApi";
import { toast } from "sonner";
import {
  GitPullRequest,
  Search,
  Filter,
  User,
  Award,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { CandidateStatus, Job } from "@/types/recruitment";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/pipeline")({
  component: RecruitmentPipelinePage,
});

const PIPELINE_STAGES: { id: CandidateStatus; label: string; color: string }[] = [
  { id: "APPLIED", label: "Applied", color: "border-gray-500/30 text-gray-400" },
  { id: "SCREENING", label: "Screening", color: "border-amber-500/30 text-amber-500" },
  { id: "INTERVIEW", label: "Interview", color: "border-blue-500/30 text-blue-500" },
  { id: "OFFER", label: "Offer", color: "border-violet-500/30 text-violet-500" },
  { id: "HIRED", label: "Hired", color: "border-emerald-500/30 text-emerald-500" },
];

function RecruitmentPipelinePage() {
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");

  const { data, isLoading, isError, refetch } = useListCandidatesQuery({
    page: 1,
    page_size: 100,
    search: search || undefined,
    job_id: selectedJobId || undefined,
  });

  const { data: jobsData } = useListJobOpeningsQuery();
  const [updateCandidate] = useUpdateCandidateMutation();

  const candidates = data?.data?.items ?? [];
  const jobs = jobsData?.data?.items ?? [];

  const handleStageMove = async (candidateId: string, targetStage: CandidateStatus) => {
    try {
      await updateCandidate({ id: candidateId, body: { status: targetStage } }).unwrap();
      toast.success(`Candidate moved to ${targetStage} stage.`);
    } catch {
      toast.error("Failed to update candidate stage.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kanban Candidate Pipeline"
        description="Visual drag-and-drop applicant tracking pipeline across hiring stages."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Kanban Pipeline" },
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
            placeholder="Search candidate name or email..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Job Openings</option>
              {jobs.map((j: Job) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Kanban Columns ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-tile h-96 animate-pulse rounded-2xl p-4" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load pipeline candidates
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching candidates from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-5 min-h-[500px]">
          {PIPELINE_STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.status === stage.id);
            return (
              <div
                key={stage.id}
                className="glass-tile rounded-2xl p-4 border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {stageCandidates.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      No candidates in {stage.label.toLowerCase()} stage.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stageCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="rounded-xl border border-border/60 bg-card/60 p-3 text-xs space-y-2 shadow-sm transition-all hover:border-primary/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground truncate">{cand.full_name}</span>
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {cand.score}/100
                            </span>
                          </div>

                          <p className="text-[11px] text-muted-foreground truncate">
                            {cand.job_title || "General Requisition"}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                            <span>{cand.applied_date || "Recent"}</span>

                            {stage.id !== "HIRED" && (
                              <button
                                onClick={() => {
                                  const candStage = cand.stage ?? cand.status ?? "APPLIED";
                                  const nextStageMap: Record<string, CandidateStatus> = {
                                    APPLIED: "SCREENING",
                                    SCREENING: "INTERVIEW",
                                    INTERVIEW: "OFFER",
                                    OFFER: "HIRED",
                                    HIRED: "HIRED",
                                    REJECTED: "REJECTED",
                                    Applied: "Screening",
                                    Screening: "Interview",
                                    Interview: "Offer",
                                    Offer: "Hired",
                                    Hired: "Hired",
                                    Rejected: "Rejected",
                                  };
                                  handleStageMove(cand.id, nextStageMap[candStage] ?? "SCREENING");
                                }}
                                className="text-primary font-bold hover:underline inline-flex items-center gap-0.5"
                              >
                                Advance <ArrowRight className="size-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
