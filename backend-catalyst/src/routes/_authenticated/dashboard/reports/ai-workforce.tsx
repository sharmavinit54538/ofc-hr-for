import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Bot, Zap, Brain, Cpu, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AI_IMPACT_METRICS } from "@/lib/reports/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/reports/ai-workforce")({
  component: AIWorkforceReportPage,
});

function AIWorkforceReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Autonomous Tasks Executed</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">2,450 / Day</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+18% Efficiency Surge</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Workflow Automation Rate</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">78.4%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">No Manual Intervention</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Query Response Time</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1.2 Seconds</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Instant AI Resolution</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Agent Resolution Accuracy</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">99.2%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">4 Active Copilots Live</p>
      </div>
    </>
  );

  const charts = (
    <div className="glass-tile space-y-3 rounded-2xl p-5">
      <h3 className="font-display text-base font-bold text-foreground">Monthly AI Hours Saved Curve</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={AI_IMPACT_METRICS}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#1e1b4b", borderRadius: "12px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="hoursSaved" name="Hours Saved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const mockAgents = [
    { agentName: "Onboarding Copilot", role: "New Hire Provisioning", tasksToday: 480, avgResponse: "0.8s", accuracy: "99.6%", status: "Active" },
    { agentName: "Policy & Benefits Assistant", role: "Employee Query Resolution", tasksToday: 1120, avgResponse: "1.1s", accuracy: "99.1%", status: "Active" },
    { agentName: "Recruitment Screener Bot", role: "Resume & Scorecard Processing", tasksToday: 540, avgResponse: "1.5s", accuracy: "98.9%", status: "Active" },
    { agentName: "Attendance & Shift Copilot", role: "Biometric Discrepancy Reconciliation", tasksToday: 310, avgResponse: "1.0s", accuracy: "99.4%", status: "Active" },
  ];

  const columns = [
    { key: "agentName", label: "AI Agent Name" },
    { key: "role", label: "Specialist Domain" },
    { key: "tasksToday", label: "Ops Completed Today" },
    { key: "avgResponse", label: "Avg Latency" },
    { key: "accuracy", label: "Resolution Accuracy" },
    { key: "status", label: "Status" },
  ];

  return (
    <ReportViewLayout
      title="Autonomous AI Workforce Telemetry & Impact Report"
      description="Autonomous agent execution statistics, hours saved through AI automation, resolution accuracy rates, and copilot response speed."
      categoryBadge="AI Workforce Report"
      kpiCards={kpis}
      chartsSection={charts}
      tableColumns={columns}
      tableData={mockAgents}
    />
  );
}
