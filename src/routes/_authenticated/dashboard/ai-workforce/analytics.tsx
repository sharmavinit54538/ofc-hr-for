import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  AlertTriangle,
  Flame,
  DollarSign,
  TrendingUp,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { runAiMode } from "@/lib/ai-workforce";
import { AgentRunnerModal } from "@/components/ai-workforce/agent-runner-modal";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/analytics")({
  component: PeopleAnalyticsAiPage,
});

function PeopleAnalyticsAiPage() {
  const [activeTab, setActiveTab] = useState("flight-risk");
  const [runnerModal, setRunnerModal] = useState<{ key: string; name: string; category: string } | null>(null);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="People Analytics AI"
        description="Predictive HR models providing root-cause flight risk analysis, burnout telemetry, compensation equity benchmarking, and headcount hiring forecasts."
        breadcrumbs={[
          { label: "AI Workforce", href: "/dashboard/ai-workforce" },
          { label: "People Analytics AI" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
          <TabsTrigger value="flight-risk" className="text-xs py-2 gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Attrition & Root Cause
          </TabsTrigger>
          <TabsTrigger value="burnout" className="text-xs py-2 gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Burnout & Engagement
          </TabsTrigger>
          <TabsTrigger value="comp" className="text-xs py-2 gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Comp Benchmarking
          </TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs py-2 gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Headcount Forecast
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Flight Risk */}
        <TabsContent value="flight-risk" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Flight Risk & Root-Cause Analysis</h3>
              <p className="text-xs text-muted-foreground">Identifies employees at high attrition risk with empirical root cause reasons.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setRunnerModal({ key: "attrition_predictor", name: "Attrition & Flight-Risk Predictor", category: "People Analytics AI" })}
              className="gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Live Prediction
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-rose-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Viktor Krum (Lead Backend Developer)</CardTitle>
                  <Badge variant="destructive" className="text-[10px]">Flight Risk: 78%</Badge>
                </div>
                <CardDescription className="text-xs">Engineering · Tenure: 3 Years 2 Months</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive dark:text-rose-300 space-y-1">
                  <span className="font-bold text-[11px]">Root Cause Drivers:</span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    <li>No salary revision in past 28 months (Comp Ratio: 0.79)</li>
                    <li>Consistently logged &gt;15 hrs OT/week in Q2</li>
                    <li>Direct manager changed twice in last 6 months</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Retention Plan:</strong> Immediate stay-interview + market comp adjustment (+14%).
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Claire Bennet (Senior Designer)</CardTitle>
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">Flight Risk: 58%</Badge>
                </div>
                <CardDescription className="text-xs">Product & Design · Tenure: 1 Year 8 Months</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 space-y-1">
                  <span className="font-bold text-[11px]">Root Cause Drivers:</span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    <li>Unused leave balance &gt; 18 days</li>
                    <li>Recent pulse survey sentiment dipped to -0.32</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Retention Plan:</strong> Mandate compulsory PTO break + project reallocation.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Burnout Alert */}
        <TabsContent value="burnout" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Burnout & Engagement Alerts</h3>
              <p className="text-xs text-muted-foreground">Proactively flags teams/departments showing high exhaustion and overtime trends.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setRunnerModal({ key: "burnout_alert", name: "Burnout & Engagement Alert Agent", category: "People Analytics AI" })}
              className="gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Burnout Telemetry
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Mobile Engineering Team</CardTitle>
                  <Badge variant="destructive" className="text-[10px]">Burnout Score: 84 / 100</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-muted-foreground">Affected Staff: 6 Engineers</p>
                <div className="p-3 rounded-lg bg-muted border">
                  <strong>Key Signals:</strong> Consecutive weekend deployments, low PTO utilization, high ticket backlog.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Customer Support Night Shift</CardTitle>
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">Burnout Score: 76 / 100</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-muted-foreground">Affected Staff: 4 Support Representatives</p>
                <div className="p-3 rounded-lg bg-muted border">
                  <strong>Key Signals:</strong> Night shift rotation exhaustion, negative sentiment in feedback forms.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Comp Benchmarking */}
        <TabsContent value="comp" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Compensation & Pay-Equity Benchmarking</h3>
              <p className="text-xs text-muted-foreground">Compares internal salary bands against industry medians to highlight equity gaps.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setRunnerModal({ key: "comp_benchmarking", name: "Compensation Benchmarking Agent", category: "People Analytics AI" })}
              className="gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Benchmark Salaries
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6 text-xs space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 rounded-xl border bg-card">
                  <span className="font-bold text-sm text-foreground">Backend Software Engineer</span>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p>Internal Avg: <span className="font-bold text-foreground">$110,000</span></p>
                    <p>Market Median: <span className="font-bold text-foreground">$135,000</span></p>
                    <Badge variant="destructive" className="text-[10px] mt-1">-18.5% Disparity</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                  <span className="font-bold text-sm text-foreground">Lead Product Designer</span>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p>Internal Avg: <span className="font-bold text-foreground">$142,000</span></p>
                    <p>Market Median: <span className="font-bold text-foreground">$145,000</span></p>
                    <Badge variant="secondary" className="text-[10px] mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">-2.1% (Within Band)</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Headcount Forecast */}
        <TabsContent value="forecast" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Headcount & Hiring Forecast</h3>
              <p className="text-xs text-muted-foreground">Predicts departmental hiring demands over the next 4 quarters.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setRunnerModal({ key: "headcount_forecast", name: "Headcount & Hiring Forecast Agent", category: "People Analytics AI" })}
              className="gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Hiring Forecast
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Q3 2026 Hiring Need</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div className="text-2xl font-black text-primary">3 Positions</div>
                <p className="text-muted-foreground">2 Senior Devs, 1 Product Designer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Q4 2026 Hiring Need</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div className="text-2xl font-black text-primary">4 Positions</div>
                <p className="text-muted-foreground">3 Support Reps, 1 DevOps Lead</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Q1 2027 Hiring Need</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div className="text-2xl font-black text-primary">6 Positions</div>
                <p className="text-muted-foreground">4 Sales Execs, 2 QA Engineers</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {runnerModal && (
        <AgentRunnerModal
          isOpen={!!runnerModal}
          onClose={() => setRunnerModal(null)}
          agentKey={runnerModal.key}
          agentName={runnerModal.name}
          category={runnerModal.category}
        />
      )}
    </div>
  );
}
