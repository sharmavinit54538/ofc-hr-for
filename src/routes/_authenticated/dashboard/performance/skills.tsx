import { createFileRoute } from "@tanstack/react-router";
import { GenericSubModuleView } from "@/components/admin/generic-module-view";

export const Route = createFileRoute("/_authenticated/dashboard/performance/skills")({
  component: () => (
    <GenericSubModuleView
      href="/dashboard/performance/skills"
      parentHref="/dashboard/performance"
      parentLabel="Performance"
      title="Skill Matrix & Competencies"
      description="Technical and soft skills taxonomy, proficiency ratings, and training gap identification."
      items={[
        { id: "1", title: "React 19 & Modern Frontend Architecture", subtitle: "Competency Level 4/5 Required for Senior Eng", status: "124 Engineers Rated", date: "Updated Jul 2026", metric: "Skill Mapped" },
      ]}
    />
  ),
});
