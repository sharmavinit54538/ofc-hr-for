import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Activity, Users, Globe, Smartphone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/activity")({
  component: ActivityLogsReportPage,
});

function ActivityLogsReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Daily Active Users (DAU)</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,140 DAU</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">91.3% Platform Engagement</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Mobile App Check-ins</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">480 Logins</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">iOS & Android App</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Active Web Sessions</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">660 Sessions</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Desktop Browser Hub</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">MFA Pass Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">100% Verified</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">MFA Enforced</p>
      </div>
    </>
  );

  const mockActivityLogs = [
    { timestamp: "2026-08-02 10:45:00", user: "Aarav Sharma", department: "Product Engineering", activity: "Viewed Attendance Logs", platform: "Web App (Chrome)", location: "Bengaluru, IN" },
    { timestamp: "2026-08-02 10:40:12", user: "Priya Patel", department: "Human Resources", activity: "Approved Leave Request REQ-9902", platform: "Mobile App (iOS)", location: "Mumbai, IN" },
    { timestamp: "2026-08-02 10:35:55", user: "Karan Verma", department: "Finance Operations", activity: "Generated Payroll Payslip", platform: "Web App (Edge)", location: "Bengaluru, IN" },
  ];

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "user", label: "User Name" },
    { key: "department", label: "Department" },
    { key: "activity", label: "User Action" },
    { key: "platform", label: "Client Platform" },
    { key: "location", label: "Geographic Location" },
  ];

  return (
    <ReportViewLayout
      title="User Activity & Platform Engagement Telemetry Report"
      description="Workforce user logins, mobile app check-ins, feature interaction heatmaps, and session location security telemetry."
      categoryBadge="Activity Logs"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockActivityLogs}
    />
  );
}
