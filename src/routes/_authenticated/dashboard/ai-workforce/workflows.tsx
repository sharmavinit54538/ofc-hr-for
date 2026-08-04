import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Zap, Play, Plus, Clock, CheckCircle2, ArrowRight, History, Loader2, Code2 } from "lucide-react";
import {
  fetchWorkflows,
  fetchWorkflowExecutions,
  createWorkflow,
  executeWorkflow,
  AIWorkflow,
  AIWorkflowExecution,
} from "@/lib/ai-workforce";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/workflows")({
  component: AutomationWorkflowsPage,
});

function AutomationWorkflowsPage() {
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [executions, setExecutions] = useState<AIWorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);

  // New Workflow Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("offer_accepted");
  const [description, setDescription] = useState("");
  const [step1Agent, setStep1Agent] = useState("onboarding_orchestrator");
  const [step2Agent, setStep2Agent] = useState("document_verifier");
  const [step3Agent, setStep3Agent] = useState("candidate_comm");

  const loadData = async () => {
    setLoading(true);
    const [wfData, exData] = await Promise.all([fetchWorkflows(), fetchWorkflowExecutions()]);
    setWorkflows(wfData);
    setExecutions(exData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateWorkflow = async () => {
    if (!name) return;
    try {
      await createWorkflow({
        name,
        trigger_event: triggerEvent,
        description,
        steps: [
          { step: 1, agent_key: step1Agent },
          { step: 2, agent_key: step2Agent },
          { step: 3, agent_key: step3Agent },
        ],
      });
      setIsModalOpen(false);
      setName("");
      setDescription("");
      await loadData();
    } catch (err) {
      console.error("Failed to create workflow:", err);
    }
  };

  const handleRunWorkflow = async (id: string) => {
    setExecutingId(id);
    try {
      await executeWorkflow(id);
      await loadData();
    } catch (err) {
      console.error("Failed to run workflow:", err);
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Automation Workflows & Orchestration"
        description="Build no-code trigger-action automation pipelines chaining autonomous AI modes. View real logged execution history with exact timestamps."
        breadcrumbs={[
          { label: "AI Workforce", href: "/dashboard/ai-workforce" },
          { label: "Automation Workflows" },
        ]}
        action={
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 text-xs">
            <Plus className="w-4 h-4" /> Create New Workflow Trigger
          </Button>
        }
      />

      {/* Active Workflows Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Active Workflow Pipelines
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {workflows.map((wf) => (
            <Card key={wf.id} className="bg-card hover:border-primary/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">{wf.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] mt-1 font-mono text-primary bg-primary/10">
                      Trigger: {wf.trigger_event}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRunWorkflow(wf.id)}
                    disabled={executingId === wf.id}
                    className="gap-1.5 text-xs"
                  >
                    {executingId === wf.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    Test Execution
                  </Button>
                </div>
                <CardDescription className="text-xs mt-2">{wf.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-2">
                  <span className="font-semibold text-muted-foreground text-[10px] uppercase">Chained Agent Pipeline</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {wf.steps.map((st, idx) => (
                      <React.Fragment key={idx}>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {st.agent_key}
                        </Badge>
                        {idx < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Real Logged Execution History */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Logged Execution History ({executions.length} Runs)
          </h3>
          <span className="text-xs text-muted-foreground">Every entry backed by real DB timestamps</span>
        </div>

        {executions.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted-foreground">
            No logged executions yet. Click "Test Execution" on a workflow above to trigger a live run.
          </Card>
        ) : (
          <div className="space-y-3">
            {executions.map((ex) => (
              <Card key={ex.id} className="p-4 bg-card/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold">{ex.workflow_name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {ex.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Started: {new Date(ex.started_at).toLocaleTimeString()}
                    </span>
                    <span>Triggered By: {ex.triggered_by}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto">
                  <pre>{JSON.stringify(ex.logs, null, 2)}</pre>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Build No-Code Trigger Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label>Workflow Name</Label>
              <Input placeholder="e.g. New Offer Acceptance Chain" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Trigger Event</Label>
              <Input placeholder="e.g. offer_accepted, resignation_submitted, leave_applied" value={triggerEvent} onChange={(e) => setTriggerEvent(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="Describe what this workflow automates..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label className="font-bold">Agent Chain Sequence</Label>
              <div className="space-y-2">
                <Input placeholder="Step 1 Agent Key (e.g. onboarding_orchestrator)" value={step1Agent} onChange={(e) => setStep1Agent(e.target.value)} />
                <Input placeholder="Step 2 Agent Key (e.g. document_verifier)" value={step2Agent} onChange={(e) => setStep2Agent(e.target.value)} />
                <Input placeholder="Step 3 Agent Key (e.g. candidate_comm)" value={step3Agent} onChange={(e) => setStep3Agent(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateWorkflow}>Save Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
