import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Sparkles,
  Search,
  Play,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { fetchAgentConfigs, updateAgentConfig, AIAgentConfig } from "@/lib/ai-workforce";
import { AgentRunnerModal } from "@/components/ai-workforce/agent-runner-modal";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/agents")({
  component: AiAgentsPage,
});

function AiAgentsPage() {
  const [agents, setAgents] = useState<AIAgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalAgent, setActiveModalAgent] = useState<AIAgentConfig | null>(null);
  const [toggleLoading, setToggleLoading] = useState<Record<string, boolean>>({});

  const loadAgents = async () => {
    setLoading(true);
    const data = await fetchAgentConfigs();
    setAgents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleToggle = async (agentKey: string, currentStatus: boolean) => {
    setToggleLoading((prev) => ({ ...prev, [agentKey]: true }));
    try {
      await updateAgentConfig(agentKey, { is_enabled: !currentStatus });
      setAgents((prev) =>
        prev.map((a) => (a.agent_key === agentKey ? { ...a, is_enabled: !currentStatus } : a))
      );
    } catch (err) {
      console.error("Failed to toggle agent status:", err);
    } finally {
      setToggleLoading((prev) => ({ ...prev, [agentKey]: false }));
    }
  };

  const categories = ["All", ...Array.from(new Set(agents.map((a) => a.category)))];

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agent_key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Autonomous HR AI Agents"
        description="24/7 AI-powered agents taking manual HR tasks and automating recruitment, onboarding, leave, payroll, performance, analytics, documents & offboarding."
        breadcrumbs={[
          { label: "AI Workforce", href: "/dashboard/ai-workforce" },
          { label: "AI Agents" },
        ]}
        action={
          <Button variant="ghost" size="sm" onClick={loadAgents} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search 32 AI modes by title, skill, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs whitespace-nowrap h-8"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Catalog Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading agent catalog...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.agent_key} className={`flex flex-col justify-between transition-all duration-200 ${!agent.is_enabled ? "opacity-60 bg-muted/20" : "bg-card"}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider">
                    {agent.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {agent.is_enabled ? "Live" : "Disabled"}
                    </span>
                    <Switch
                      checked={agent.is_enabled}
                      onCheckedChange={() => handleToggle(agent.agent_key, agent.is_enabled)}
                      disabled={toggleLoading[agent.agent_key]}
                    />
                  </div>
                </div>
                <CardTitle className="text-base font-bold mt-2 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0" />
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {agent.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> ~{agent.avg_manual_minutes}m saved/run
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> HITL Protection
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => setActiveModalAgent(agent)}
                  disabled={!agent.is_enabled}
                  className="w-full text-xs gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Execute {agent.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeModalAgent && (
        <AgentRunnerModal
          isOpen={!!activeModalAgent}
          onClose={() => setActiveModalAgent(null)}
          agentKey={activeModalAgent.agent_key}
          agentName={activeModalAgent.name}
          category={activeModalAgent.category}
          onSuccess={loadAgents}
        />
      )}
    </div>
  );
}
