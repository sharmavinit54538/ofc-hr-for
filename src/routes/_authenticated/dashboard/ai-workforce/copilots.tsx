import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu,
  UserCheck,
  UserPlus,
  Briefcase,
  CreditCard,
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { queryCopilot, AICopilotResponse } from "@/lib/ai-workforce";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/copilots")({
  component: SmartCopilotsPage,
});

interface CopilotRole {
  id: string;
  title: string;
  icon: any;
  desc: string;
  samplePrompt: string;
}

const COPILOT_ROLES: CopilotRole[] = [
  { id: "hrbp", title: "HR Business Partner", icon: UserCheck, desc: "Case management assistant, employee relations & stay-interview advisory.", samplePrompt: "How should I structure a stay-interview for a high flight-risk senior engineer?" },
  { id: "recruiter", title: "Recruiter Co-Pilot", icon: UserPlus, desc: "Candidate sourcing strategy, personalized cold outreach drafting & skill mapping.", samplePrompt: "Draft a compelling cold outreach email for a Senior Lead DevOps candidate." },
  { id: "manager", title: "Manager Co-Pilot", icon: Briefcase, desc: "1-on-1 meeting prep, performance review narrative drafting & OKR goal alignment.", samplePrompt: "Help me draft performance review feedback for a frontend developer who exceeded sprint goals." },
  { id: "finance", title: "Finance & Payroll Co-Pilot", icon: CreditCard, desc: "Payroll anomaly resolution guidance, statutory tax explainer & variance analysis.", samplePrompt: "Explain why our Q3 state professional tax liability increased by 12%." },
];

function SmartCopilotsPage() {
  const [selectedRole, setSelectedRole] = useState<CopilotRole>(COPILOT_ROLES[0]!);
  const [inputQuery, setInputQuery] = useState(COPILOT_ROLES[0]!.samplePrompt);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AICopilotResponse | null>(null);

  const handleSelectRole = (role: typeof COPILOT_ROLES[0]) => {
    setSelectedRole(role);
    setInputQuery(role.samplePrompt);
    setResponse(null);
  };

  const handleQuery = async () => {
    if (!inputQuery.trim()) return;
    setLoading(true);
    try {
      const res = await queryCopilot(selectedRole.id, inputQuery);
      setResponse(res);
    } catch (err) {
      console.error("Copilot Query Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Role-Specific Smart Co-Pilots"
        description="Dedicated interactive AI co-pilots tailored for HR Business Partners, Recruiters, Managers, and Finance/Payroll professionals."
        breadcrumbs={[
          { label: "AI Workforce", href: "/dashboard/ai-workforce" },
          { label: "Smart Co-Pilots" },
        ]}
      />

      {/* Role Selection Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COPILOT_ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole.id === role.id;
          return (
            <Card
              key={role.id}
              onClick={() => handleSelectRole(role)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary" : "hover:border-primary/50 bg-card"
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-bold">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <CardDescription className="text-[11px] line-clamp-2">{role.desc}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Chat Console */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-base font-bold">{selectedRole.title} Assistant</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Role: {selectedRole.id.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Ask your Co-Pilot a question or request a draft:</label>
            <Textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              rows={3}
              className="text-xs"
              placeholder="Type your instruction or scenario..."
            />
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={handleQuery} disabled={loading} className="gap-2 text-xs">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send to {selectedRole.title}
            </Button>
          </div>

          {/* AI Response Block */}
          {response && (
            <div className="p-5 rounded-xl bg-muted/50 border space-y-4 text-xs animate-in fade-in-50">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Cpu className="w-4 h-4" /> Co-Pilot Guidance & Response
              </div>

              <p className="text-foreground leading-relaxed whitespace-pre-line">{response.reply}</p>

              {response.suggested_actions?.length > 0 && (
                <div className="space-y-2 pt-3 border-t">
                  <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Suggested One-Click Actions:</span>
                  <div className="flex flex-wrap gap-2">
                    {response.suggested_actions.map((act, i) => (
                      <Button key={i} size="sm" variant="outline" className="text-[11px] h-7 gap-1 border-primary/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {act}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
