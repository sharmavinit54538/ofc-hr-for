import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListCompetenciesQuery,
  useCreateCompetencyMutation,
  useUpdateCompetencyMutation,
  useDeleteCompetencyMutation,
} from "@/services/performanceApi";
import { useListEmployeesQuery } from "@/services/employeeApi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Inbox,
  AlertTriangle,
  RefreshCw,
  Award,
  Trash2,
  Filter,
  CheckCircle,
} from "lucide-react";
import { CompetencyCategory } from "@/types/performance";

export const Route = createFileRoute("/_authenticated/dashboard/performance/skills")({
  component: PerformanceSkillsPage,
});

function PerformanceSkillsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState<CompetencyCategory>("TECHNICAL");
  const [proficiencyLevel, setProficiencyLevel] = useState<number>(3);
  const [requiredLevel, setRequiredLevel] = useState<number>(4);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // API Hooks
  const { data, isLoading, isError, refetch } = useListCompetenciesQuery({
    page,
    page_size: 15,
    search: search || undefined,
    category: categoryFilter || undefined,
  });

  const { data: employeesData } = useListEmployeesQuery();
  const [createCompetency, { isLoading: isCreating }] = useCreateCompetencyMutation();
  const [updateCompetency] = useUpdateCompetencyMutation();
  const [deleteCompetency] = useDeleteCompetencyMutation();

  const competencies = data?.data?.items ?? [];
  const totalPages = data?.data?.total_pages ?? 1;
  const employees = employeesData?.data?.items ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) {
      toast.error("Please provide a skill name.");
      return;
    }

    try {
      await createCompetency({
        skill_name: skillName,
        category,
        proficiency_level: proficiencyLevel,
        required_level: requiredLevel,
        employee_id: selectedEmployeeId || undefined,
      }).unwrap();

      toast.success("Competency skill mapped successfully.");
      setIsCreateOpen(false);
      setSkillName("");
    } catch {
      toast.error("Failed to map competency.");
    }
  };

  const handleLevelChange = async (id: string, newLevel: number) => {
    try {
      await updateCompetency({ id, body: { proficiency_level: newLevel } }).unwrap();
      toast.success("Skill proficiency updated.");
    } catch {
      toast.error("Failed to update skill level.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competency record?")) return;
    try {
      await deleteCompetency(id).unwrap();
      toast.success("Competency record deleted.");
    } catch {
      toast.error("Failed to delete competency.");
    }
  };

  const getCategoryBadge = (cat: CompetencyCategory) => {
    switch (cat) {
      case "TECHNICAL":
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">Technical</span>;
      case "LEADERSHIP":
        return <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-500">Leadership</span>;
      case "SOFT":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Soft Skill</span>;
      default:
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Domain</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Matrix & Competencies"
        description="Technical and soft skills taxonomy, proficiency ratings, and training gap identification."
        breadcrumbs={[
          { label: "Performance", href: "/dashboard/performance" },
          { label: "Skills Matrix" },
        ]}
        actions={
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Skill Mapping
          </button>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search competencies by skill name..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring focus:shadow-glow placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
            >
              <option value="">All Categories</option>
              <option value="TECHNICAL">Technical</option>
              <option value="SOFT">Soft Skill</option>
              <option value="LEADERSHIP">Leadership</option>
              <option value="DOMAIN">Domain</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-tile h-36 animate-pulse rounded-2xl p-5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load skill matrix data
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching competency ratings from backend.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : competencies.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No competency mappings found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No competency skill matrices exist in PostgreSQL for your search query.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Add First Skill Mapping
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competencies.map((comp) => (
            <div
              key={comp.id}
              className="glass-tile group flex flex-col justify-between rounded-2xl p-5 border border-border transition-all duration-300 hover-lift hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  {getCategoryBadge(comp.category)}
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Required: Level {comp.required_level}/5
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {comp.skill_name}
                </h3>
                {comp.employee_name && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Employee: {comp.employee_name}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1">
                  <span>Proficiency Rating</span>
                  <span className="text-primary font-bold">{comp.proficiency_level} / 5</span>
                </div>

                {/* Rating Dots/Bar */}
                <div className="flex gap-1.5 my-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(comp.id, level)}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        level <= comp.proficiency_level
                          ? level <= comp.required_level
                            ? "bg-primary"
                            : "bg-emerald-500"
                          : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Assessed: {comp.last_assessed_at || "Recent"}</span>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-1 hover:text-destructive transition-colors"
                    title="Delete Competency"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Modal ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border">
            <h3 className="text-base font-bold font-display text-foreground mb-4">
              Add Competency Skill Mapping
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. React 19 Architecture, System Design"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Skill Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CompetencyCategory)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="TECHNICAL">Technical Skill</option>
                  <option value="SOFT">Soft Skill</option>
                  <option value="LEADERSHIP">Leadership</option>
                  <option value="DOMAIN">Domain Expertise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Employee (Optional)
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                >
                  <option value="">Self / Me</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Current Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={proficiencyLevel}
                    onChange={(e) => setProficiencyLevel(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Required Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={requiredLevel}
                    onChange={(e) => setRequiredLevel(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isCreating ? "Saving..." : "Save Mapping"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
