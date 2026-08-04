import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

export const Route = createFileRoute("/_authenticated/dashboard/it-admin/reports")({
  component: ItAdminReportsPage,
});

function ItAdminReportsPage() {
  const reports = [
    { title: "Monthly IT Security & Threat Detection Log Audit", type: "Security", format: "CSV" },
    { title: "MFA Enforcement & Authenticator Adoption Rate", type: "Identity", format: "PDF" },
    { title: "SaaS Application License Utilization Audit", type: "Licensing", format: "XLSX" },
    { title: "System Uptime & API SLA Performance (Q2 2026)", type: "Infrastructure", format: "PDF" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="IT Infrastructure & Security Reports"
        description="Download IT compliance audit reports, MFA adoption metrics, and licensing utilization logs."
        breadcrumbs={[{ label: "IT Admin", href: "/dashboard/it-admin" }, { label: "Reports" }]}
        backHref="/dashboard/it-admin"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <div key={r.title} className="glass-tile rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-2">
                {r.type}
              </span>
              <h3 className="font-display text-sm font-bold text-foreground">{r.title}</h3>
            </div>
            <button
              onClick={() => toast.success(`Exporting ${r.title}`)}
              className="glass-tile w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold hover:bg-secondary"
            >
              <Download className="size-3.5" /> Export Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
