import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListReviewsQuery,
  useCreateReviewMutation,
  useSubmitReviewMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
  useExportPerformanceReportMutation,
  useListReviewCyclesQuery,
} from "@/services/performanceApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Download,
  Inbox,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Send,
  Trash2,
  Filter,
} from "lucide-react";
import { ReviewStatus, ReviewType } from "@/types/performance";

export const Route = createFileRoute("/_authenticated/dashboard/performance/reviews")({
  component: PerformanceReviewsPage,
});

function PerformanceReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [reviewType, setReviewType] = useState<ReviewType>("MANAGER");
  const [rating, setRating] = useState<number>(3.5);
  const [comments, setComments] = useState("");

  // API Hooks
  const { data, isLoading, isError, refetch } = useListReviewsQuery({
    page,
    page_size: 15,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: cyclesData } = useListReviewCyclesQuery();
  const { data: employeesData } = useListEmployeesQuery();

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [submitReview] = useSubmitReviewMutation();
  const [approveReview] = useApproveReviewMutation();
  const [rejectReview] = useRejectReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [exportReport, { isLoading: isExporting }] = useExportPerformanceReportMutation();

  const reviews = data?.data?.items ?? [];
  const totalPages = data?.data?.total_pages ?? 1;

  const cycles = cyclesData?.data?.items ?? [];
  const employees = employeesData?.data?.items ?? [];

  const handleExport = async () => {
    try {
      const blob = await exportReport({ format: "csv" }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `performance_reviews_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Performance report downloaded successfully.");
    } catch {
      toast.error("Failed to export performance report.");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCycleId || !selectedEmployeeId) {
      toast.error("Please select a review cycle and an employee.");
      return;
    }

    try {
      await createReview({
        review_cycle_id: selectedCycleId,
        employee_id: selectedEmployeeId,
        review_type: reviewType,
        rating,
        comments,
      }).unwrap();
      toast.success("Performance review created successfully.");
      setIsCreateOpen(false);
      setComments("");
    } catch {
      toast.error("Failed to create performance review.");
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      await submitReview(id).unwrap();
      toast.success("Review submitted for approval.");
    } catch {
      toast.error("Failed to submit review.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id).unwrap();
      toast.success("Review approved successfully.");
    } catch {
      toast.error("Failed to approve review.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id).unwrap();
      toast.success("Review rejected.");
    } catch {
      toast.error("Failed to reject review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case "APPROVED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Approved</span>;
      case "SUBMITTED":
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">Submitted</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Rejected</span>;
      case "DRAFT":
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Draft</span>;
      default:
        return <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appraisal Cycles & Reviews"
        description="Mid-year check-ins, annual reviews, self-assessments, and 9-box talent matrix calibration."
        breadcrumbs={[
          { label: "Performance", href: "/dashboard/performance" },
          { label: "Reviews" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Download className="size-3.5" /> {isExporting ? "Exporting..." : "Export Report"}
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="size-4" /> Create Review
            </button>
          </div>
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
            placeholder="Search reviews by employee name..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="glass-tile rounded-2xl p-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load performance reviews
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching review records from the backend API.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No performance reviews found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            There are no performance reviews matching your criteria in the PostgreSQL database.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Create First Review
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Employee</th>
                  <th className="px-5 py-3.5 font-bold">Reviewer</th>
                  <th className="px-5 py-3.5 font-bold">Type</th>
                  <th className="px-5 py-3.5 font-bold">Rating</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reviews.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">
                      {r.employee_name || "Employee"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {r.reviewer_name || "Assigned Manager"}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {r.review_type}
                    </td>
                    <td className="px-5 py-4 font-bold text-primary">
                      {r.rating ? `${r.rating} / 5` : "Unrated"}
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(r.status)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === "PENDING" && (
                          <button
                            onClick={() => handleSubmit(r.id)}
                            title="Submit Review"
                            className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-500/10"
                          >
                            <Send className="size-4" />
                          </button>
                        )}
                        {r.status === "SUBMITTED" && (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              title="Approve Review"
                              className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10"
                            >
                              <CheckCircle className="size-4" />
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              title="Reject Review"
                              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                            >
                              <XCircle className="size-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          title="Delete Review"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-input px-3 py-1 hover:bg-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-input px-3 py-1 hover:bg-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Create Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Create Performance Review
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Review Cycle
                </label>
                <select
                  value={selectedCycleId}
                  onChange={(e) => setSelectedCycleId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Cycle...</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.cycle_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Review Type
                </label>
                <select
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value as ReviewType)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="MANAGER">Manager Review</option>
                  <option value="SELF">Self Review</option>
                  <option value="PEER">Peer Review</option>
                  <option value="360">360 Feedback Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Initial Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Comments / Notes
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter initial review notes..."
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
                  {isCreating ? "Saving..." : "Create Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
