import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Award,
  User,
  Eye,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useDebounce } from "@/hooks/useDebounce";
import { useListCandidatesQuery } from "@/services/recruitmentApi";
import { getApiErrorMessage } from "@/utils/api-error";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/candidates")({
  component: RecruitmentCandidatesPage,
});

function RecruitmentCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedJob, setSelectedJob] = useState("All Positions");
  const [viewingCandidate, setViewingCandidate] = useState<any | null>(null);

  const debouncedSearch = useDebounce(searchQuery);

  const { data, isLoading, isError, error, refetch, isFetching } = useListCandidatesQuery({
    search: debouncedSearch || undefined,
    page: 1,
    page_size: 100,
  });

  const rawCandidates = useMemo(() => {
    if (!data) return [];
    const d = (data as any).data ?? data;
    if (Array.isArray(d)) return d;
    if (Array.isArray((d as any).items)) return (d as any).items;
    if (Array.isArray((d as any).candidates)) return (d as any).candidates;
    return [];
  }, [data]);

  const candidatesList = useMemo(() => {
    return rawCandidates.map((cand: any) => {
      // Extract Candidate Name from all possible backend schemas
      const name =
        cand.name ||
        cand.full_name ||
        cand.candidate_name ||
        ((cand.first_name || cand.last_name)
          ? `${cand.first_name || ""} ${cand.last_name || ""}`.trim()
          : "") ||
        (cand.email ? cand.email.split("@")[0] : "Candidate Record");

      // Extract Job Title / Position Applied
      const jobTitle =
        cand.job_title ||
        cand.current_role ||
        cand.position ||
        cand.role ||
        cand.designation ||
        "—";

      // Extract Contact Information
      const email = cand.email || cand.personal_email || cand.contact_email || "—";
      const phone = cand.phone || cand.contact_number || cand.alternate_phone || "—";
      const location = cand.location || cand.city || cand.work_location || "—";

      // Extract Stage & ATS Score
      const stage = cand.stage || cand.status || cand.match_tier || "Applied";
      const score = cand.ats_score ?? cand.screening_score ?? cand.score;

      // Extract and Format Application Date
      let dateFormatted = "—";
      const rawDate = cand.applied_at || cand.created_at || cand.applied_date;
      if (rawDate) {
        try {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            dateFormatted = d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } else {
            dateFormatted = String(rawDate);
          }
        } catch {
          dateFormatted = String(rawDate);
        }
      }

      return {
        id: cand.id || cand.candidate_id || String(Math.random()),
        name,
        email,
        phone,
        location,
        jobTitle,
        stage: String(stage),
        score: typeof score === "number" ? Math.round(score) : null,
        dateFormatted,
        rawObj: cand,
      };
    });
  }, [rawCandidates]);

  const availableJobs = useMemo(() => {
    const jobs = new Set<string>();
    candidatesList.forEach((c: any) => {
      if (c.jobTitle && c.jobTitle !== "—") jobs.add(c.jobTitle);
    });
    return ["All Positions", ...Array.from(jobs)];
  }, [candidatesList]);

  const filteredCandidates = useMemo(() => {
    return candidatesList.filter((cand: any) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const match =
          cand.name.toLowerCase().includes(q) ||
          cand.email.toLowerCase().includes(q) ||
          cand.jobTitle.toLowerCase().includes(q) ||
          cand.stage.toLowerCase().includes(q) ||
          cand.location.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedStage !== "All Stages") {
        const selUpper = selectedStage.toUpperCase();
        const candStageUpper = cand.stage.toUpperCase();
        if (selUpper === "APPLIED") {
          if (
            !candStageUpper.includes("APPLIED") &&
            !candStageUpper.includes("PENDING") &&
            !candStageUpper.includes("NEW")
          ) {
            return false;
          }
        } else if (!candStageUpper.includes(selUpper)) {
          return false;
        }
      }

      if (selectedJob !== "All Positions") {
        if (cand.jobTitle.toLowerCase() !== selectedJob.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [candidatesList, debouncedSearch, selectedStage, selectedJob]);

  const renderStageBadge = (stageStr: string) => {
    const stg = stageStr.toUpperCase();
    if (stg.includes("HIRED")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          <CheckCircle2 className="size-3 text-emerald-400" /> Hired
        </span>
      );
    }
    if (stg.includes("INTERVIEW")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
          <Clock className="size-3 text-purple-400" /> Interview
        </span>
      );
    }
    if (stg.includes("SCREENING")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
          <Sparkles className="size-3 text-amber-400" /> Screening
        </span>
      );
    }
    if (stg.includes("OFFER")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-400">
          <Award className="size-3 text-sky-400" /> Offer Sent
        </span>
      );
    }
    if (stg.includes("REJECT")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
          <UserX className="size-3 text-rose-400" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">
        <UserCheck className="size-3 text-indigo-400" /> {stageStr}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        title="Candidates Directory"
        description="Talent pool database, candidate stage tracking, screening scorecards, and ATS applications."
        breadcrumbs={[{ label: "Recruitment", href: "/dashboard/recruitment" }, { label: "Candidates" }]}
        backHref="/dashboard/recruitment"
        backLabel="Back to Recruitment"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
            >
              <Download className="size-3.5" /> Export List
            </button>
          </div>
        }
      />

      {/* ── Search & Filter Toolbar ────────────────────────────── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name, email, position applied, stage, location..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground">
              Total Candidates ({filteredCandidates.length})
              {isFetching && !isLoading ? " · syncing…" : ""}
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          {/* Stage Filter */}
          <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs shadow-sm">
            <Filter className="mr-1.5 size-3.5 text-muted-foreground" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground min-w-[150px]"
            >
              <option value="All Stages" className="bg-card text-foreground">
                All Application Stages
              </option>
              <option value="Applied" className="bg-card text-foreground">
                Applied / Pending
              </option>
              <option value="Screening" className="bg-card text-foreground">
                Screening
              </option>
              <option value="Interview" className="bg-card text-foreground">
                Interview
              </option>
              <option value="Offer" className="bg-card text-foreground">
                Offer Sent
              </option>
              <option value="Hired" className="bg-card text-foreground">
                Hired
              </option>
              <option value="Rejected" className="bg-card text-foreground">
                Rejected
              </option>
            </select>
          </div>

          {/* Job / Position Filter */}
          <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs shadow-sm">
            <Briefcase className="mr-1.5 size-3.5 text-muted-foreground" />
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground min-w-[150px]"
            >
              {availableJobs.map((job) => (
                <option key={job} value={job} className="bg-card text-foreground">
                  {job}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(selectedStage !== "All Stages" || selectedJob !== "All Positions" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStage("All Stages");
                setSelectedJob("All Positions");
                setSearchQuery("");
              }}
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Candidates Data Table ──────────────────────────────── */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground font-bold">
              <tr>
                <th className="px-4 py-3.5">Candidate</th>
                <th className="px-4 py-3.5">Position Applied</th>
                <th className="px-4 py-3.5">Stage</th>
                <th className="px-4 py-3.5 text-center">ATS Score</th>
                <th className="px-4 py-3.5">Applied Date</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    Loading recruitment candidate database…
                  </td>
                </tr>
              )}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <p className="font-semibold text-destructive">
                      {getApiErrorMessage(error as FetchBaseQueryError)}
                    </p>
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="mt-3 inline-flex items-center rounded-lg border border-input px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No candidates found matching current search and stage filters.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                filteredCandidates.map((cand: any) => (
                  <tr key={cand.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-brand font-display font-bold text-primary-foreground shadow-glow">
                          {cand.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{cand.name}</p>
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Mail className="size-3" /> {cand.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{cand.jobTitle}</p>
                      {cand.location !== "—" && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MapPin className="size-3 text-muted-foreground" /> {cand.location}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">{renderStageBadge(cand.stage)}</td>
                    <td className="px-4 py-4 text-center">
                      {cand.score !== null ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary shadow-sm">
                          <Award className="size-3 text-primary" /> {cand.score}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3 text-muted-foreground" />
                        {cand.dateFormatted}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setViewingCandidate(cand)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 shadow-sm"
                      >
                        <Eye className="size-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Candidate Details Modal ────────────────────────────── */}
      <Dialog open={Boolean(viewingCandidate)} onOpenChange={(open) => !open && setViewingCandidate(null)}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
          {viewingCandidate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground shadow-glow">
                    {viewingCandidate.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="font-display text-xl font-bold">
                      {viewingCandidate.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Applied for {viewingCandidate.jobTitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" /> Email:
                  </span>
                  <span className="font-semibold text-foreground">{viewingCandidate.email}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" /> Phone:
                  </span>
                  <span className="font-semibold text-foreground">{viewingCandidate.phone}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-primary" /> Applied Position:
                  </span>
                  <span className="font-semibold text-foreground">{viewingCandidate.jobTitle}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" /> Location:
                  </span>
                  <span className="font-semibold text-foreground">{viewingCandidate.location}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" /> Stage:
                  </span>
                  <span>{renderStageBadge(viewingCandidate.stage)}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" /> ATS Match Score:
                  </span>
                  <span className="font-bold text-primary">
                    {viewingCandidate.score !== null ? `${viewingCandidate.score}%` : "Not Screened"}
                  </span>
                </div>
              </div>

              <DialogFooter className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingCandidate(null)}
                  className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  Close Profile
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
