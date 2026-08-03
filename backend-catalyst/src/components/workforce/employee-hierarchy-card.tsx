import { useMemo } from "react";
import { ChevronRight, ShieldCheck, Users, Mail, User, Building2, Briefcase } from "lucide-react";
import type { Employee } from "@/types/employee";
import { computeEmployeeHierarchyInfo } from "@/utils/hierarchy";

export function EmployeeHierarchyCard({
  employee,
  allEmployees,
  onSelectEmployee,
}: {
  employee: Employee;
  allEmployees: Employee[];
  onSelectEmployee?: (emp: Employee) => void;
}) {
  const info = useMemo(
    () => computeEmployeeHierarchyInfo(employee, allEmployees),
    [employee, allEmployees],
  );

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4">
      {/* ── Hierarchy Level & Org Path Breadcrumb ───────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Organization Hierarchy Position
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary shadow-sm">
            <ShieldCheck className="size-3" /> Level {info.level} ({info.levelBadge})
          </span>
        </div>

        {/* Path Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-2 text-xs">
          {info.organizationPath.map((pathItem, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span
                className={`font-semibold ${
                  idx === info.organizationPath.length - 1
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {pathItem}
              </span>
              {idx < info.organizationPath.length - 1 && (
                <ChevronRight className="size-3 text-muted-foreground/60" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Direct Manager Card ────────────────────────────────── */}
      <div>
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
          Direct Reporting Manager
        </h4>
        {info.reportingManager ? (
          <div
            onClick={() => onSelectEmployee?.(info.reportingManager!)}
            className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/70 p-3 transition-all hover:border-primary/40 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-brand font-display text-sm font-bold text-primary-foreground shadow-glow">
                {info.reportingManager.full_name?.charAt(0) ?? "M"}
              </div>
              <div>
                <p className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                  {info.reportingManager.full_name}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Briefcase className="size-3 text-primary/70" />{" "}
                  {info.reportingManager.job_title || "Manager"}
                </p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground/80">
                  <Mail className="size-3" /> {info.reportingManager.email}
                </p>
              </div>
            </div>
            <span className="rounded-lg bg-secondary/80 px-2 py-1 text-[10px] font-semibold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              View Manager
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 bg-card/40 p-3 text-xs text-muted-foreground italic flex items-center gap-2">
            <User className="size-4 text-primary" /> Top Level Executive / No Direct Manager Assigned
          </div>
        )}
      </div>

      {/* ── Direct Reports Grid ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Direct Reports ({info.directReports.length})
          </h4>
          <span className="text-[10px] font-semibold text-muted-foreground">
            Total Span: {info.teamSize} Member{info.teamSize === 1 ? "" : "s"}
          </span>
        </div>

        {info.directReports.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic rounded-xl border border-border/30 bg-card/30 p-2.5">
            No direct reportees under this employee.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
            {info.directReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onSelectEmployee?.(report)}
                className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 p-2.5 text-xs transition-all hover:bg-secondary/60 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-brand text-[10px] font-bold text-primary-foreground shadow-glow">
                    {report.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{report.full_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {report.job_title} · {report.department || "General"}
                    </p>
                  </div>
                </div>
                <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {report.employee_id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Full Ancestor Reporting Chain ──────────────────────── */}
      {info.reportingChain.length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
            Complete Chain of Command ({info.reportingChain.length} Levels)
          </h4>
          <div className="relative pl-4 space-y-2 border-l-2 border-primary/30">
            {info.reportingChain.map((ancestor, idx) => (
              <div key={ancestor.id} className="relative flex items-center gap-2 text-xs">
                <div className="absolute -left-[21px] size-2 rounded-full bg-primary ring-4 ring-background" />
                <span className="font-mono text-[10px] text-muted-foreground font-bold">
                  L{idx + 1}
                </span>
                <span className="font-bold text-foreground">{ancestor.full_name}</span>
                <span className="text-muted-foreground text-[11px]">
                  ({ancestor.job_title})
                </span>
              </div>
            ))}
            <div className="relative flex items-center gap-2 text-xs">
              <div className="absolute -left-[21px] size-2.5 rounded-full bg-emerald-500 ring-4 ring-background" />
              <span className="font-mono text-[10px] text-emerald-500 font-bold">
                L{info.level}
              </span>
              <span className="font-bold text-primary">{employee.full_name} (Current)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
