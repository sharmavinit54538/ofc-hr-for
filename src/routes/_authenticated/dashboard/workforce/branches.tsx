import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Building, MapPin, Users, Globe, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useListEmployeesQuery } from "@/services/employeeApi";

export const Route = createFileRoute("/_authenticated/dashboard/workforce/branches")({
  component: BranchesPage,
});

interface BranchItem {
  name: string;
  country: string;
  city: string;
  address: string;
  count: number;
  type: string;
}

function BranchesPage() {
  const { data: employeesRes, isLoading } = useListEmployeesQuery({ page: 1, page_size: 100 });
  const [customBranches, setCustomBranches] = useState<BranchItem[]>([]);

  // Derive branches from real API employees
  const apiBranches = useMemo<BranchItem[]>(() => {
    const items = employeesRes?.data?.items ?? [];
    const branchMap = new Map<string, { count: number }>();

    items.forEach((emp) => {
      const loc = emp.branch || emp.location;
      if (loc && loc.trim()) {
        const key = loc.trim();
        const existing = branchMap.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          branchMap.set(key, { count: 1 });
        }
      }
    });

    return Array.from(branchMap.entries()).map(([name, val], idx) => ({
      name,
      country: "Global / Local Site",
      city: name,
      address: "Primary Office Facility",
      count: val.count,
      type: idx === 0 ? "Main Campus" : "Regional Office",
    }));
  }, [employeesRes]);

  const allBranches = useMemo(() => {
    return [...apiBranches, ...customBranches];
  }, [apiBranches, customBranches]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Office Branches"
        description="Physical office campuses, legal entities, and geographic regional hubs."
        breadcrumbs={[{ label: "Workforce", href: "/dashboard/workforce" }, { label: "Branches" }]}
        backHref="/dashboard/workforce"
        backLabel="Back to Workforce"
        actions={
          <button
            onClick={() => {
              const name = prompt("Enter Branch/Office Location Name:");
              if (name && name.trim()) {
                setCustomBranches((prev) => [
                  ...prev,
                  {
                    name: name.trim(),
                    country: "India",
                    city: name.trim(),
                    address: "Primary Site Location",
                    count: 0,
                    type: "Office Location",
                  },
                ]);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Add Office Branch
          </button>
        }
      />

      {isLoading ? (
        <div className="glass-tile flex items-center justify-center p-12 rounded-2xl">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading branch locations...</span>
        </div>
      ) : allBranches.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center p-12 text-center rounded-2xl space-y-3">
          <Building className="size-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-bold text-foreground">No Office Branches Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Add employee locations or click "Add Office Branch" above to register physical office sites.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allBranches.map((b) => (
            <div key={b.name} className="glass-tile group rounded-2xl p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <Building className="size-5" />
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {b.type}
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {b.name}
                </h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 text-primary" /> {b.city}
                </p>
                <p className="text-[11px] text-muted-foreground/80 line-clamp-1">{b.address}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-foreground">
                  <Users className="size-3.5 text-primary" /> {b.count} On-Site
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Globe className="size-3" /> {b.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

