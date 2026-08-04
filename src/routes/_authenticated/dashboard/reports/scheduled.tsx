import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Play,
  Trash2,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/reports/scheduled")({
  component: ScheduledReportsPage,
});

interface ScheduledJob {
  id: string;
  reportTitle: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  recipients: string;
  nextExecution: string;
  status: "Active" | "Paused";
}

function ScheduledReportsPage() {
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reportTitle: "Executive Summary & Financial KPI Digest",
    frequency: "Weekly" as ScheduledJob["frequency"],
    recipients: "",
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipients.trim()) {
      toast.error("Please enter recipient email addresses.");
      return;
    }

    const newJob: ScheduledJob = {
      id: `sch_${Date.now()}`,
      reportTitle: formData.reportTitle,
      frequency: formData.frequency,
      recipients: formData.recipients,
      nextExecution: `Scheduled (${formData.frequency})`,
      status: "Active",
    };

    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
    toast.success("Automated Report Scheduled", {
      description: `Report dispatch scheduled for ${formData.frequency} delivery.`,
    });
  };

  const toggleStatus = (id: string) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === id) {
          const nextStatus = job.status === "Active" ? "Paused" : "Active";
          toast.info(`Schedule ${nextStatus}`, {
            description: `Job ID ${id} is now ${nextStatus}.`,
          });
          return { ...job, status: nextStatus };
        }
        return job;
      }),
    );
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
    toast.success("Schedule Removed");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Scheduled Reports"
        description="Configure automated recurring email reports (Daily, Weekly, Monthly, Quarterly, Yearly) sent directly to executive leadership & HR managers."
        breadcrumbs={[
          { label: "Reports", href: "/dashboard/reports" },
          { label: "Scheduled Reports" },
        ]}
        backHref="/dashboard/reports"
        backLabel="Back to Reports Center"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Schedule Automated Report
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Schedules</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {jobs.filter((j) => j.status === "Active").length} Jobs
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Calendar className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configured Schedules</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{jobs.length} Total</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Mail className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Engine</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">Automated Dispatch</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Table */}
      {jobs.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Inbox className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Scheduled Reports Configured</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are currently no automated recurring email report schedules configured. Click "Schedule Automated Report" above to set up automated email dispatch.
          </p>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Report Title</th>
                  <th className="px-5 py-3.5 font-bold">Frequency</th>
                  <th className="px-5 py-3.5 font-bold">Recipient List</th>
                  <th className="px-5 py-3.5 font-bold">Next Schedule</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-bold text-foreground">{job.reportTitle}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {job.frequency}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{job.recipients}</td>
                    <td className="px-5 py-4 text-muted-foreground">{job.nextExecution}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          job.status === "Active"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(job.id)}
                          className="rounded-lg border border-border bg-card/60 p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title={job.status === "Active" ? "Pause Schedule" : "Resume Schedule"}
                        >
                          <Play className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20"
                          title="Delete Schedule"
                        >
                          <Trash2 className="size-3.5" />
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

      {/* Schedule Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Automated Report</DialogTitle>
            <DialogDescription>
              Configure recurring email dispatch for executive digests and operational analytics.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJob} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground">Select Report Module</label>
              <select
                value={formData.reportTitle}
                onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none focus:border-ring"
              >
                <option value="Executive Summary & Financial KPI Digest">Executive Summary & Financial KPI Digest</option>
                <option value="Daily Attendance & Late Punch Audit">Daily Attendance & Late Punch Audit</option>
                <option value="Monthly Payroll & Statutory Tax Return">Monthly Payroll & Statutory Tax Return</option>
                <option value="Quarterly Workforce Growth & Attrition">Quarterly Workforce Growth & Attrition</option>
                <option value="IT Asset & Security Compliance Log">IT Asset & Security Compliance Log</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Execution Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as ScheduledJob["frequency"] })}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none focus:border-ring"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">Recipient Email Addresses</label>
              <input
                type="text"
                required
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                placeholder="e.g. manager@company.com, exec@company.com"
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-xs outline-none focus:border-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg"
              >
                Save Schedule
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
