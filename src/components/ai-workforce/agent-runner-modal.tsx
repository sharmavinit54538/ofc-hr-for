import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Clock, ShieldAlert } from "lucide-react";
import { runAiMode, AIModeExecutionResult } from "@/lib/ai-workforce";

interface AgentRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentKey: string;
  agentName: string;
  category: string;
  defaultPrompt?: string;
  onSuccess?: () => void;
}

export function AgentRunnerModal({
  isOpen,
  onClose,
  agentKey,
  agentName,
  category,
  defaultPrompt = "",
  onSuccess,
}: AgentRunnerModalProps) {
  const [promptInput, setPromptInput] = useState(defaultPrompt);
  const [customField1, setCustomField1] = useState("");
  const [customField2, setCustomField2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIModeExecutionResult | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload: Record<string, any> = {
      prompt: promptInput,
    };

    if (customField1) payload.candidate_name = customField1;
    if (customField1 && agentKey.includes("employee")) payload.employee_name = customField1;
    if (customField2) payload.role = customField2;

    try {
      const res = await runAiMode(agentKey, agentName, payload);
      setResult(res);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to execute AI agent mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{agentName}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Domain: <Badge variant="outline" className="ml-1 text-[10px]">{category}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 py-2">
            <div className="grid gap-3">
              <Label className="text-xs font-semibold">Primary Target / Subject (Optional)</Label>
              <Input
                placeholder="e.g. Candidate Name, Employee Name, or Job Role"
                value={customField1}
                onChange={(e) => setCustomField1(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid gap-3">
              <Label className="text-xs font-semibold">Role / Department Context (Optional)</Label>
              <Input
                placeholder="e.g. Senior Full Stack Engineer / Product Team"
                value={customField2}
                onChange={(e) => setCustomField2(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid gap-3">
              <Label className="text-xs font-semibold">Custom AI Prompt / Instructions</Label>
              <Textarea
                placeholder="Enter specific instructions or leave blank to run standard autonomous analysis..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={4}
                className="text-xs"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border text-xs">
              <div className="flex items-center gap-2">
                {result.status === "pending_approval" ? (
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                <span className="font-semibold capitalize">
                  Status: {result.status === "pending_approval" ? "Sent to HITL Approval Queue" : "Executed Successfully"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {result.duration_ms}ms
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Confidence: {Math.round(result.confidence_score * 100)}%
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">AI Generated Output Payload</Label>
              <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[300px]">
                <pre>{JSON.stringify(result.result, null, 2)}</pre>
              </div>
            </div>

            {result.hitl_item_id && (
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                <strong>Human-in-the-Loop Action Required:</strong> This action involves candidate/employee communication or official document generation. It has been held in the <strong>HITL Queue</strong> for manager review.
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleRun} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Run AI Mode
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setResult(null)}>
                Run Another Test
              </Button>
              <Button size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
