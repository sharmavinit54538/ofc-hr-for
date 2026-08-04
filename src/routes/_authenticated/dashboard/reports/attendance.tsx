import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { useGetAttendanceReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/attendance")({
  component: AttendanceReportPage,
});

function AttendanceReportPage() {
  const { data: attendanceRes } = useGetAttendanceReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const attendance = attendanceRes?.data;

  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Attendance Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {attendance?.on_time_rate ?? 0}%
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Real-time Biometric Sync</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Check-ins Today</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {attendance?.total_checkins ?? 0} Staff
        </div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Active Punch Logs</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Late Arrivals</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {attendance?.late_checkins ?? 0} Logs
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Grace Period Exception</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Working Hours</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">
          {attendance?.avg_working_hours ?? 0} Hours
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Standard Shifts</p>
      </div>
    </>
  );

  const tableData = [
    {
      metric: "Total Daily Punch Logs Processed",
      value: `${attendance?.total_checkins ?? 0} Log Entries`,
    },
    {
      metric: "On-time Shift Compliance Rate",
      value: `${attendance?.on_time_rate ?? 0}%`,
    },
    {
      metric: "Average Daily Working Shift Duration",
      value: `${attendance?.avg_working_hours ?? 0} Hours`,
    },
  ];

  const columns = [
    { key: "metric", label: "Attendance Metric" },
    { key: "value", label: "Value" },
  ];

  return (
    <ReportViewLayout
      title="Attendance & Time-Tracking Telemetry Report"
      description="Biometric punch logs, shift scheduling compliance, late arrivals, missing punch regularization, and daily attendance percentages."
      categoryBadge="Attendance Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
