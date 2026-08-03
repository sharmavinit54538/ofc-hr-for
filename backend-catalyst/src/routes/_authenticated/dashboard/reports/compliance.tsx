import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { ShieldCheck, AlertTriangle, FileLock, History } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/compliance")({
  component: ComplianceReportPage,
});

function ComplianceReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Overall Compliance Index</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">99.8%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">SOC2 Type II Certified</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Critical Policy Breaches</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">0 Risks</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Zero Breaches Detected</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Statutory Labor Filings</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">100% Up-To-Date</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Verified Govt Returns</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Audit Log Integrity</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">Immutable</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Cryptographic Hashing</p>
      </div>
    </>
  );

  const mockComplianceData = [
    { mandate: "SOC 2 Type II Security Standard", domain: "Information Security", lastAudit: "2026-07-15", score: "100%", status: "Compliant" },
    { mandate: "Statutory PF / ESI Returns", domain: "Payroll & Labor", lastAudit: "2026-08-01", score: "100%", status: "Compliant" },
    { mandate: "GDPR / DPDP Data Protection Act", domain: "Privacy Policy", lastAudit: "2026-06-30", score: "99.4%", status: "Compliant" },
    { mandate: "Workplace Harassment (POSH) Policy", domain: "HR Policy", lastAudit: "2026-07-20", score: "99.8%", status: "Compliant" },
  ];

  const columns = [
    { key: "mandate", label: "Regulatory Mandate / Policy" },
    { key: "domain", label: "Compliance Domain" },
    { key: "lastAudit", label: "Last Audit Date" },
    { key: "score", label: "Compliance Score" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Statutory & Regulatory Audit Compliance Report"
      description="Global labor law adherence, statutory tax filing audit logs, policy breach monitoring, and SOC2 compliance telemetry."
      categoryBadge="Compliance Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockComplianceData}
    />
  );
}
