import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListLeaveRequestsQuery,
  useGetLeaveStatsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestStatusMutation,
  useDeleteLeaveRequestMutation,
} from "@/services/leaveApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Filter,
  Search,
  Clock,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/leave/requests")({
  component: LeaveRequestsPage,
});

function LeaveRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");

  // API Hooks
  const { data: requestsRes, isLoading, isError, refetch } = useListLeaveRequestsQuery({
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const { data: statsRes } = useGetLeaveStatsQuery();
  const { data: employeesRes } = useListEmployeesQuery();

  const [createLeaveRequest, { isLoading: isSubmitting }] = useCreateLeaveRequestMutation();
  const [updateStatus] = useUpdateLeaveRequestStatusMutation();
  const [deleteRequest] = useDeleteLeaveRequestMutation();

  const requests = requestsRes?.data ?? [];
  const stats = statsRes?.data;
  const employees = employeesRes?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !leaveType) {
      toast.error("Please select an employee and leave type.");
      return;
    }

    try {
      await createLeaveRequest({
        user_id: selectedUserId,
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        days: days || 1,
        reason: reason || "Personal PTO",
      }).unwrap();

      toast.success("Leave application submitted successfully.");
      setIsModalOpen(false);
      setSelectedUserId("");
      setReason("");
    } catch {
      toast.error("Failed to submit leave application.");
    }
  };

  const handleStatusAction = async (id: string, status: "Approved" | "Rejected") => {
    try {
      await updateStatus({
        id,
        body: { status },
      }).unwrap();
      toast.success(`Leave request ${status.toLowerCase()} successfully.`);
    } catch {
      toast.error("Failed to update leave status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave application?")) return;
    try {
      await deleteRequest(id).unwrap();
      toast.success("Leave application deleted.");
    } catch {
      toast.error("Failed to delete leave application.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Approved</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Rejected</span>;
      default:
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Pending Approval</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Applications & Requests"
        description="Comprehensive time-off tracking, PTO approvals, medical certificates, and manager workflow pipeline backed by PostgreSQL."
        breadcrumbs={[
          { label: "Leave", href: "/dashboard/leave" },
          { label: "Leave Applications" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Apply for Leave
          </button>
        }
      />

      {/* ── Telemetry KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pending Approvals</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.pending_count ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Awaiting manager signoff</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Approved Leaves</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.approved_today ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Granted time-off requests</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rejected</span>
            <XCircle className="size-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.rejected_count ?? 0}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Declined applications</p>
        </div>

        <div className="glass-tile rounded-2xl p-4 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total PTO Days</span>
            <Calendar className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {stats?.total_pto_days ?? 0} Days
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Approved cumulative PTO</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications by employee name, email, or leave type..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Content Area / Table ── */}
      {isLoading ? (
        <div className="glass-tile h-64 animate-pulse rounded-2xl p-6" />
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load leave applications
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching leave requests from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No leave requests found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No employee leave applications match your search or filter criteria.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Apply for Leave
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card/80 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Applicant</th>
                  <th className="p-3.5">Leave Type</th>
                  <th className="p-3.5">Date Range</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-card/40 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground">{req.employee_name}</div>
                      <div className="text-[11px] text-muted-foreground">{req.employee_email || req.department}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-primary">{req.leave_type}</td>
                    <td className="p-3.5 font-mono text-muted-foreground">
                      {req.from_date} – {req.to_date}
                    </td>
                    <td className="p-3.5 font-bold text-foreground">{req.days} Day(s)</td>
                    <td className="p-3.5 text-muted-foreground max-w-xs truncate">{req.reason}</td>
                    <td className="p-3.5">{getStatusBadge(req.status)}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status.toUpperCase() === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusAction(req.id, "Approved")}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                              title="Approve Leave"
                            >
                              <CheckCircle2 className="size-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleStatusAction(req.id, "Rejected")}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/20"
                              title="Reject Leave"
                            >
                              <XCircle className="size-3" /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Request"
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
        </div>
      )}

      {/* ── Apply for Leave Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Submit Leave Application
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Applicant Employee</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.user_id || emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.department_name || "Employee"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Privilege Leave">Privilege Leave (PL / PTO)</option>
                  <option value="Maternity / Paternity">Maternity / Paternity Leave</option>
                  <option value="Comp Off">Compensatory Off (Comp Off)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Total Days</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Reason / Justification</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for time-off..."
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isSubmitting ? "Saving..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
