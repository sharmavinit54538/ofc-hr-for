import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/ai-workforce/agents")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/ai-workforce/agents"
      parentHref="/dashboard/ai-workforce"
      parentLabel="AI Workforce"
      title="Autonomous HR AI Agents"
      description="24/7 AI employee support bot, policy resolver, resume screener, and compliance monitor."
      items={[
        { id: "1", title: "OFC Policy Assistant Agent", subtitle: "Answers employee HR & leave queries instantly", status: "Active · 99.4% Resolution", date: "Handled 1,420 chats today", metric: "LLM Powered" },
        { id: "2", title: "Smart Resume Screener Agent", subtitle: "Extracts skills, grades candidates, ranks resumes", status: "Active · Screening", date: "Processed 380 resumes", metric: "Automated" },
      ]}
    />
  ),
});
