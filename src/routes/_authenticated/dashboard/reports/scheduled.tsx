import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Play,
  Trash2,
  CheckCircle2,
  PauseCircle,
  FileSpreadsheet,
  FileText,
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
  format: "PDF" | "Excel" | "CSV";
  nextExecution: string;
  status: "Active" | "Paused";
}

function ScheduledReportsPage() {
  const [jobs, setJobs] = useState<ScheduledJob[]>([
    {
      id: "sch-1",
      reportTitle: "Executive Summary & Financial KPI Digest",
      frequency: "Weekly",
      recipients: "exec-team@company.com, cfo@company.com",
      format: "PDF",
      nextExecution: "Every Monday at 08:00 AM",
      status: "Active",
    },
    {
      id: "sch-2",
      reportTitle: "Daily Attendance & Late Punch Audit",
      frequency: "Daily",
      recipients: "hr-ops@company.com",
      format: "Excel",
      nextExecution: "Every Day at 09:00 AM",
      status: "Active",
    },
    {
      id: "sch-3",
      reportTitle: "Monthly Payroll & Statutory Tax Return",
      frequency: "Monthly",
      recipients: "finance-leads@company.com",
      format: "Excel",
      nextExecution: "1st of every Month",
      status: "Active",
    },
    {
      id: "sch-4",
      reportTitle: "Quarterly Workforce Growth & Attrition",
      frequency: "Quarterly",
      recipients: "board@company.com",
      format: "PDF",
      nextExecution: "Oct 01, 2026",
      status: "Active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reportTitle: "Executive Summary & Financial KPI Digest",
    frequency: "Weekly" as ScheduledJob["frequency"],
    recipients: "hr-admin@company.com",
    format: "PDF" as ScheduledJob["format"],
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: ScheduledJob = {
      id: `sch_${Date.now()}`,
      reportTitle: formData.reportTitle,
      frequency: formData.frequency,
      recipients: formData.recipients,
      format: formData.format,
      nextExecution: `Scheduled (${formData.frequency})`,
      status: "Active",
    };

    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
    toast.success("Scheduled Report Created", {
      description: `Automated email dispatch configured for ${formData.frequency} schedule.`,
    });
  };

  const toggleStatus = (id: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === id ? { ...j, status: j.status === "Active" ? "Paused" : "Active" } : j,
      ),
    );
    toast.info("Schedule Status Toggled");
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
    toast.success("Schedule Deleted");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Automated Report Engines"
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> New Scheduled Report
          </button>
        }
      />

      {/* KPI Banner */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Schedules</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {jobs.filter((j) => j.status === "Active").length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Emails Sent</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">182 Reports</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
            <Mail className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Success Rate</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">100% Delivered</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Calendar className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Dispatch Window</p>
            <p className="font-display text-xl font-bold text-foreground mt-1">Tomorrow 08:00 AM</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Report Title</th>
                <th className="px-5 py-3.5 font-bold">Frequency</th>
                <th className="px-5 py-3.5 font-bold">Recipient List</th>
                <th className="px-5 py-3.5 font-bold">Format</th>
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
                  <td className="px-5 py-4 font-mono font-semibold text-foreground">{job.format}</td>
                  <td className="px-5 py-4 text-muted-foreground">{job.nextExecution}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${job.status === "Active"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleStatus(job.id)}
                        className="glass-tile rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                        title="Toggle Status"
                      >
                        <PauseCircle className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="glass-tile rounded-lg p-1.5 text-destructive hover:bg-destructive/10"
                        title="Delete Schedule"
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

      {/* Schedule Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Configure Scheduled Email Report</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Automate email delivery of report PDFs and Excel data sheets.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJob} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Select Report</label>
              <select
                value={formData.reportTitle}
                onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
              >
                <option>Executive Summary & Financial KPI Digest</option>
                <option>Daily Attendance & Late Punch Audit</option>
                <option>Monthly Payroll & Statutory Tax Return</option>
                <option>Quarterly Workforce Growth & Attrition</option>
                <option>Hardware Asset Valuation & Depreciation</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">File Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="PDF">PDF Report</option>
                  <option value="Excel">Excel (.xlsx)</option>
                  <option value="CSV">CSV Data</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Recipient Emails (Comma separated)</label>
              <input
                type="text"
                required
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none font-mono"
              />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Create Automation
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
