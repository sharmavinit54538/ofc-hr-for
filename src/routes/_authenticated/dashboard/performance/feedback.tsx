import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListFeedbackQuery,
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
} from "@/services/performanceApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Inbox,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Award,
  Trash2,
  Filter,
} from "lucide-react";
import { FeedbackType } from "@/types/performance";

export const Route = createFileRoute("/_authenticated/dashboard/performance/feedback")({
  component: PerformanceFeedbackPage,
});

function PerformanceFeedbackPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [receiverId, setReceiverId] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("PRAISE");
  const [content, setContent] = useState("");
  const [badge, setBadge] = useState("Kudos Granted");
  const [isPublic, setIsPublic] = useState(true);

  // API Hooks
  const { data, isLoading, isError, refetch } = useListFeedbackQuery({
    page,
    page_size: 15,
    search: search || undefined,
    feedback_type: typeFilter || undefined,
  });

  const { data: employeesData } = useListEmployeesQuery();
  const [createFeedback, { isLoading: isCreating }] = useCreateFeedbackMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const feedbackList = data?.data?.items ?? [];
  const totalPages = data?.data?.total_pages ?? 1;
  const employees = employeesData?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !content) {
      toast.error("Please select a recipient and enter feedback content.");
      return;
    }

    try {
      await createFeedback({
        receiver_id: receiverId,
        feedback_type: feedbackType,
        content,
        badge,
        is_public: isPublic,
      }).unwrap();

      toast.success("Feedback submitted successfully.");
      setIsCreateOpen(false);
      setContent("");
    } catch {
      toast.error("Failed to submit feedback.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteFeedback(id).unwrap();
      toast.success("Feedback deleted.");
    } catch {
      toast.error("Failed to delete feedback.");
    }
  };

  const getTypeBadge = (type: FeedbackType) => {
    switch (type) {
      case "PRAISE":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Praise</span>;
      case "CONSTRUCTIVE":
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Constructive</span>;
      case "UPWARD":
        return <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-500">Upward</span>;
      default:
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">Peer</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="360 Continuous Feedback"
        description="Peer praise, constructive check-ins, upward feedback, and manager notes."
        breadcrumbs={[
          { label: "Performance", href: "/dashboard/performance" },
          { label: "360 Feedback" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Give Feedback
          </button>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search feedback comments..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Feedback Types</option>
              <option value="PRAISE">Praise</option>
              <option value="CONSTRUCTIVE">Constructive</option>
              <option value="PEER">Peer</option>
              <option value="UPWARD">Upward</option>
            </select>
          </div>
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
            Failed to load feedback records
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching feedback from the backend API.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No feedback found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No 360 feedback entries exist in PostgreSQL for your search parameters.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Give First Feedback
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  {getTypeBadge(fb.feedback_type)}
                  {fb.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Award className="size-3" /> {fb.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{fb.content}"
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">
                    To: {fb.receiver_name || "Employee"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    From: {fb.giver_name || "Peer / Manager"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Feedback"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Give Feedback Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Give 360 Feedback
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Recipient Employee
                </label>
                <select
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Recipient...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Feedback Type
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="PRAISE">Public Praise / Kudos</option>
                  <option value="CONSTRUCTIVE">Constructive Feedback</option>
                  <option value="PEER">Peer Check-in</option>
                  <option value="UPWARD">Upward Manager Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Badge (Optional)
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="Kudos Granted">Kudos Granted</option>
                  <option value="Team Player">Team Player</option>
                  <option value="Great Leadership">Great Leadership</option>
                  <option value="Innovation Star">Innovation Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Feedback Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
