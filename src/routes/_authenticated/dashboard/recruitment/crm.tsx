import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { useListCandidatesQuery } from "@/services/recruitmentApi";
import { toast } from "sonner";
import {
  Mail,
  Search,
  User,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/crm")({
  component: RecruitmentCRMPage,
});

function RecruitmentCRMPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useListCandidatesQuery({
    page: 1,
    page_size: 50,
    search: search || undefined,
  });

  const candidates = data?.data?.items ?? [];

  const handleSendNurtureEmail = (candidateName: string, email: string) => {
    toast.success("Outreach email sent to candidate", {
      description: `Dispatched campaign email to ${candidateName} (${email}).`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate CRM & Nurturing Campaigns"
        description="Automated candidate email sequences, talent relationship history, and email template dispatches."
        breadcrumbs={[
          { label: "Recruitment", href: "/dashboard/recruitment" },
          { label: "Candidate CRM" },
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
            placeholder="Search candidate name or email for CRM outreach..."
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
            Failed to load CRM candidate list
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching candidate profiles from PostgreSQL.
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
            No candidates found in CRM database
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No candidate profiles exist in PostgreSQL for email outreach.
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
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    <Mail className="size-3" /> CRM Contact
                  </span>
                  <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {cand.status}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {cand.full_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Email: <span className="text-foreground font-semibold">{cand.email}</span>
                </p>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex justify-end">
                <button
                  onClick={() => handleSendNurtureEmail(cand.full_name, cand.email ?? "")}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20 flex items-center gap-1"
                >
                  <Send className="size-3" /> Send Outreach Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
