import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_APPROVALS, ApprovalItem } from "@/lib/approvals/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/approvals/")({
  component: ApprovalsLandingPage,
});

function ApprovalsLandingPage() {
  const approvalNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "approvals");
  const [items, setItems] = useState<ApprovalItem[]>(MOCK_APPROVALS);
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: "Approved" } : i)));
    toast.success("Request Approved", { description: "Workflow status updated to Approved." });
  };

  const handleReject = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: "Rejected" } : i)));
    toast.error("Request Rejected", { description: "Workflow status updated to Rejected." });
  };

  const handleBulkApprove = () => {
    setItems(items.map((i) => (i.status === "Pending" ? { ...i, status: "Approved" } : i)));
    toast.success("Bulk Approvals Executed", { description: "All pending items approved." });
  };

  const filtered = items.filter((i) => {
    const matchesTab = activeTab === "All" ? true : i.status === activeTab;
    const matchesSearch =
      i.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const kpiCards = [
    { title: "Pending Approvals", value: items.filter((i) => i.status === "Pending").length.toString(), sub: "Action Required", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Approved Requests", value: items.filter((i) => i.status === "Approved").length.toString(), sub: "Completed Workflow", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Rejected Requests", value: items.filter((i) => i.status === "Rejected").length.toString(), sub: "Declined by Manager", icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Urgent Priority", value: items.filter((i) => i.priority === "Urgent").length.toString(), sub: "SLA < 24 Hours", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Total Workflows", value: items.length.toString(), sub: "Across 12 Categories", icon: Layers, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Avg Turnaround", value: "4.2 Hours", sub: "Fast Approval Velocity", icon: CheckSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Centralized Enterprise Approval Center"
        description="Unified manager approval queue across leave, attendance regularizations, payroll claims, requisitions, expense reports, promotions & transfers."
        breadcrumbs={[{ label: "Approvals" }]}
        actions={
          <button
            onClick={handleBulkApprove}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <ThumbsUp className="size-4" /> Bulk Approve All Pending
          </button>
        }
      />

      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Approval Action Queue */}
      <div className="space-y-4">
        <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(["Pending", "Approved", "Rejected", "All"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "glass-tile text-muted-foreground hover:bg-secondary"
                }`}
              >
                {tab} Requests
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request, requester..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
            />
          </div>
        </div>

        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Approval ID</th>
                  <th className="px-5 py-3.5 font-bold">Category Type</th>
                  <th className="px-5 py-3.5 font-bold">Request Title</th>
                  <th className="px-5 py-3.5 font-bold">Requester</th>
                  <th className="px-5 py-3.5 font-bold">Priority</th>
                  <th className="px-5 py-3.5 font-bold">Submitted Time</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Quick Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{item.approvalId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{item.type}</td>
                    <td className="px-5 py-4 font-semibold text-foreground max-w-xs truncate">{item.requestTitle}</td>
                    <td className="px-5 py-4 text-muted-foreground">{item.requesterName} ({item.requesterDept})</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.priority === "Urgent" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{item.submittedDate}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        item.status === "Approved"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : item.status === "Rejected"
                          ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                          : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {item.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 inline-flex items-center gap-1"
                          >
                            <ThumbsUp className="size-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 inline-flex items-center gap-1"
                          >
                            <ThumbsDown className="size-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground font-mono text-[11px]">{item.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sub-Modules */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Specific Approval Category Workflows</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {approvalNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>
    </div>
  );
}
