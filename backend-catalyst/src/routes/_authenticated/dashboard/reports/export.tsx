import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { REPORTS_CATALOGUE } from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/export")({
  component: ExportCenterPage,
});

function ExportCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = REPORTS_CATALOGUE.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownloadFile = (title: string, format: string) => {
    toast.success(`Downloading ${title}`, {
      description: `File packaged as ${format} archive and downloading.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central Export & Archive Center"
        description="Download packaged PDF executive digests, raw Excel data sheets, and CSV dumps across all 23 enterprise modules."
        breadcrumbs={[
          { label: "Reports", href: "/dashboard/reports" },
          { label: "Export Center" },
        ]}
        backHref="/dashboard/reports"
        backLabel="Back to Reports Center"
      />

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Download Volume</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">420 Exports</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Download className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Excel Data Packages</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">210 Sheets</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <FileSpreadsheet className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">PDF Executive Digests</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">160 Digests</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <FileText className="size-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-tile flex items-center justify-between rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report archive by title or category..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} Exportable Reports
        </span>
      </div>

      {/* Export Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Report Title</th>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Last Generated</th>
                <th className="px-5 py-3.5 font-bold">Default Format</th>
                <th className="px-5 py-3.5 font-bold text-right">Instant Download Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((report) => (
                <tr key={report.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">{report.title}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{report.lastGenerated}</td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{report.exportFormat}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownloadFile(report.title, "PDF")}
                        className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDownloadFile(report.title, "Excel")}
                        className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        Excel
                      </button>
                      <button
                        onClick={() => handleDownloadFile(report.title, "CSV")}
                        className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-[11px] font-bold text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
                      >
                        CSV
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
