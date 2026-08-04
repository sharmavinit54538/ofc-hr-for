import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { useListCandidatesQuery } from "@/services/recruitmentApi";
import {
  UserPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Inbox,
  UserCheck,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/onboarding")({
  component: RecruitmentOnboardingPage,
});

function RecruitmentOnboardingPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useListCandidatesQuery({
    page: 1,
    page_size: 50,
    status: "HIRED",
    search: search || undefined,
  });

  const hiredCandidates = data?.data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Hire Onboarding Handover Tracker"
        description="Track hired candidate transition into HR onboarding, document collection, and IT equipment provisioning."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Onboarding Handover" },
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
            placeholder="Search new hires by name or email..."
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
            Failed to load hired candidates
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching new hire data from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : hiredCandidates.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No hired candidates pending onboarding
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Candidates marked as <strong>"Hired"</strong> in the recruitment pipeline will appear here for onboarding handover.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hiredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="size-3" /> Hired
                  </span>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">
                    Handover Ready
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {cand.full_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Position: <span className="text-foreground font-semibold">{cand.job_title || "New Hire"}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Email: <span className="text-foreground font-semibold">{cand.email}</span>
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <FileCheck className="size-3 text-emerald-500" /> Documents Verified
                </span>
                <span className="text-[11px] font-semibold text-primary">Provisioning...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
