import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Loader2, Inbox } from "lucide-react";
import { useGetAttendanceReportQuery } from "@/services/reportsApi";

export const Route = createFileRoute("/_authenticated/dashboard/reports/attendance")({
  component: AttendanceReportPage,
});

function AttendanceReportPage() {
  const { data: attendanceRes, isLoading } = useGetAttendanceReportQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const attendance = attendanceRes?.data;
  const totalCheckins = attendance?.total_checkins ?? 0;

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
          {totalCheckins} Staff
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

  const tableData = totalCheckins > 0 ? [
    {
      metric: "Total Daily Punch Logs Processed",
      value: `${totalCheckins} Log Entries`,
    },
    {
      metric: "On-time Shift Compliance Rate",
      value: `${attendance?.on_time_rate ?? 0}%`,
    },
    {
      metric: "Average Daily Working Shift Duration",
      value: `${attendance?.avg_working_hours ?? 0} Hours`,
    },
  ] : [];

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
      chartsSection={
        isLoading ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
            <Loader2 className="size-5 animate-spin text-primary" /> Loading attendance telemetry...
          </div>
        ) : totalCheckins === 0 ? (
          <div className="glass-tile rounded-2xl p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground text-sm">No Attendance Telemetry Logs Found</p>
            <p className="text-[11px] max-w-xs">
              Daily biometric check-ins and shift punch logs will appear here once attendance records exist in PostgreSQL.
            </p>
          </div>
        ) : null
      }
      tableColumns={columns}
      tableData={tableData}
    />
  );
}
