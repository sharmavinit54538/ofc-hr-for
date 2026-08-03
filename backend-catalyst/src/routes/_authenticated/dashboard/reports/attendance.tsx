import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ATTENDANCE_WEEKLY_TREND } from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/attendance")({
  component: AttendanceReportPage,
});

function AttendanceReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Attendance Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">96.4%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Real-time Biometric Sync</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Late Arrivals Today</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">14 Staff</div>
        <p className="text-[10px] text-amber-400 font-semibold mt-0.5">Within Grace Period</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Missing Punches</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">3 Logs</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Pending Regularization</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Working Hours</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">8.4 Hours</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Standard Shifts</p>
      </div>
    </>
  );

  const charts = (
    <div className="glass-tile space-y-3 rounded-2xl p-5">
      <h3 className="font-display text-base font-bold text-foreground">Weekly Attendance & Late Punch Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ATTENDANCE_WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} domain={[90, 100]} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
            <Bar dataKey="present" name="Present %" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const mockLogs = [
    { employee: "Aarav Sharma", department: "Product Engineering", checkIn: "08:55 AM", checkOut: "05:45 PM", workingHours: "8.8 hrs", status: "Present" },
    { employee: "Priya Patel", department: "Human Resources", checkIn: "09:12 AM", checkOut: "06:00 PM", workingHours: "8.8 hrs", status: "Late Arrival" },
    { employee: "Karan Verma", department: "Finance Operations", checkIn: "09:00 AM", checkOut: "05:30 PM", workingHours: "8.5 hrs", status: "Present" },
    { employee: "Rohan Kapoor", department: "Customer Success", checkIn: "09:30 AM", checkOut: "--:--", workingHours: "In Progress", status: "Missing Punch-Out" },
  ];

  const columns = [
    { key: "employee", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "checkIn", label: "Check-In Time" },
    { key: "checkOut", label: "Check-Out Time" },
    { key: "workingHours", label: "Working Hours" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Attendance & Time-Tracking Telemetry Report"
      description="Biometric punch logs, shift scheduling compliance, late arrivals, missing punch regularization, and daily attendance percentages."
      categoryBadge="Attendance Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockLogs}
    />
  );
}
