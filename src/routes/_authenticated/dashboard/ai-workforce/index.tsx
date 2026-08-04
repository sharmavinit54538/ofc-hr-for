import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Bot,
  Zap,
  Brain,
  Cpu,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Play,
  ArrowRight,
  UserCheck,
  UserPlus,
  CalendarCheck,
  CreditCard,
  TrendingUp as PerformanceIcon,
  FileText,
  CheckSquare,
  Megaphone,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { fetchAiDashboardStats, AIDashboardStats } from "@/lib/ai-workforce";
import { AgentRunnerModal } from "@/components/ai-workforce/agent-runner-modal";
import { HitlApprovalDrawer } from "@/components/ai-workforce/hitl-approval-drawer";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/")({
  component: AiWorkforceLandingPage,
});

const DOMAIN_MODULES = [
  { id: "recruitment", title: "Recruitment & Hiring AI", category: "Recruitment & Hiring", icon: UserPlus, count: 6, desc: "Resume Screener, JD Generator, Interview Question Generator, Offer Letter Agent, Candidate Comm.", keyAgent: "resume_screener" },
  { id: "onboarding", title: "Onboarding AI", category: "Onboarding", icon: UserCheck, count: 3, desc: "Onboarding Orchestrator, Document Verification OCR, New Hire Q&A Bot.", keyAgent: "onboarding_orchestrator" },
  { id: "attendance", title: "Attendance & Leave AI", category: "Attendance & Leave", icon: CalendarCheck, count: 3, desc: "Attendance Anomaly Detection, Leave Approval Copilot, Shift Roster Optimizer.", keyAgent: "leave_copilot" },
  { id: "payroll", title: "Payroll & Compliance AI", category: "Payroll & Compliance", icon: CreditCard, count: 3, desc: "Payroll Anomaly Checker, Tax Compliance Assistant, Payslip Query Bot.", keyAgent: "payroll_anomaly" },
  { id: "performance", title: "Performance Management AI", category: "Performance Management", icon: PerformanceIcon, count: 4, desc: "Review Writer, Goal Suggester, 360 Feedback Synthesizer, Promotion Readiness Score.", keyAgent: "promotion_readiness" },
  { id: "analytics", title: "People Analytics AI", category: "People Analytics AI", icon: Brain, count: 4, desc: "Flight-Risk Predictor with Root-Cause, Burnout Alert, Comp Benchmarking, Headcount Forecast.", keyAgent: "attrition_predictor" },
  { id: "documents", title: "Documents & Policy AI", category: "Documents & Policy", icon: FileText, count: 3, desc: "Policy Q&A RAG over policy docs, Certificate Generation, Contract Review Assistant.", keyAgent: "policy_qa" },
  { id: "approvals", title: "Approvals AI", category: "Approvals AI", icon: CheckSquare, count: 1, desc: "Approval Triage Agent with 1-line AI auto-recommendations.", keyAgent: "approval_triage" },
  { id: "helpdesk", title: "Communication & Helpdesk AI", category: "Communication & Helpdesk", icon: Megaphone, count: 3, desc: "HR Helpdesk Resolver, Announcement & Survey Drafter, Sentiment Analyzer.", keyAgent: "helpdesk_resolver" },
  { id: "offboarding", title: "Offboarding & Exit AI", category: "Offboarding / Exit", icon: LogOut, count: 2, desc: "Exit Interview Analyzer, Offboarding Checklist Agent.", keyAgent: "offboarding_checklist" },
];

function AiWorkforceLandingPage() {
  const [stats, setStats] = useState<AIDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hitlOpen, setHitlOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{ key: string; name: string; category: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAiDashboardStats();
    setStats(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Workforce Suite"
        description="Autonomous HR AI agents, automated workflow orchestration & real-time predictive analytics."
        breadcrumbs={[{ label: "AI Workforce" }]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHitlOpen(true)}
              className="relative gap-2 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <ShieldAlert className="w-4 h-4" />
              HITL Approvals Queue
              {stats?.pending_hitl_count ? (
                <Badge className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0 text-[10px] rounded-full">
                  {stats.pending_hitl_count}
                </Badge>
              ) : null}
            </Button>
            <Button variant="ghost" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        }
      />

      {/* KPI Cards Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Calculated Hours Saved
            </CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {stats ? `${stats.total_hours_saved} hrs` : "..."}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Computed from logged agent runs × manual task time
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Resolution Rate
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {stats ? `${stats.average_resolution_rate}%` : "..."}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Live success rate across all agent executions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Executions (Today / Month)
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {stats ? `${stats.total_executions_today} / ${stats.total_executions_month}` : "..."}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Real logged model calls today vs current month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Autonomous Modes
            </CardTitle>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {stats ? `${stats.active_agent_count} / ${stats.total_agent_count}` : "32 / 32"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Live backend modes configured & online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Domains Launcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> Autonomous HR AI Modes Catalog
          </h2>
          <span className="text-xs text-muted-foreground">10 Functional Domains · 32 AI Modes</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {DOMAIN_MODULES.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card key={domain.id} className="group relative overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold">{domain.title}</CardTitle>
                        <Badge variant="secondary" className="text-[10px] mt-0.5">
                          {domain.count} AI Modes
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedAgent({
                          key: domain.keyAgent,
                          name: `${domain.title} Runner`,
                          category: domain.category,
                        })
                      }
                      className="gap-1 text-xs"
                    >
                      <Play className="w-3 h-3 text-primary fill-primary" /> Launch Mode
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs line-clamp-2">{domain.desc}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* HITL Drawer & Runner Modal */}
      <HitlApprovalDrawer isOpen={hitlOpen} onClose={() => setHitlOpen(false)} onRefresh={loadData} />
      {selectedAgent && (
        <AgentRunnerModal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          agentKey={selectedAgent.key}
          agentName={selectedAgent.name}
          category={selectedAgent.category}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
