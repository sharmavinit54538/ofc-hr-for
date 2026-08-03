import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingDown,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { MOCK_CATEGORIES } from "@/lib/assets/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/assets/reports")({
  component: AssetReportsPage,
});

function AssetReportsPage() {
  const [timeframe, setTimeframe] = useState("FY 2026-27");

  const handleExportReport = (format: string) => {
    toast.success(`Exporting ${format} Report`, {
      description: `Asset Valuation & Depreciation Schedule downloaded as ${format}.`,
    });
  };

  const departmentBreakdown = [
    { department: "Product Engineering", itemCount: 680, valuation: 740000, pct: "52%" },
    { department: "Human Resources", itemCount: 120, valuation: 110000, pct: "8%" },
    { department: "Information Technology", itemCount: 310, valuation: 340000, pct: "24%" },
    { department: "Finance Operations", itemCount: 180, valuation: 130000, pct: "9%" },
    { department: "Executive Office", itemCount: 130, valuation: 100000, pct: "7%" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Valuation & Financial Reports"
        description="Comprehensive asset telemetry, hardware depreciation schedules, book value calculations, and custom data export builder."
        breadcrumbs={[
          { label: "Asset Management", href: "/dashboard/assets" },
          { label: "Asset Reports" },
        ]}
        backHref="/dashboard/assets"
        backLabel="Back to Asset Management"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportReport("PDF")}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
            >
              <Download className="size-3.5 text-rose-500" /> Export PDF
            </button>
            <button
              onClick={() => handleExportReport("Excel")}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-500" /> Export Excel
            </button>
          </div>
        }
      />

      {/* Top Financial Valuation Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Acquisition Cost</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">$1,420,000</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <DollarSign className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Book Value (Current)</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">$980,450</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <BarChart3 className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Depreciation</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">$139,550</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <TrendingDown className="size-5" />
          </div>
        </div>

        <div className="glass-tile rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Replacement Cost</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">$1,580,000</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <PieChart className="size-5" />
          </div>
        </div>
      </div>

      {/* Department Capital Allocation */}
      <div className="glass-tile space-y-4 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">
            Department-wise Hardware Capital Allocation
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">Updated FY26</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departmentBreakdown.map((dept) => (
            <div key={dept.department} className="rounded-xl border border-border/50 bg-card/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{dept.department}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {dept.pct} Share
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground pt-1">
                <span>Items Issued: <strong>{dept.itemCount}</strong></span>
                <span className="font-bold text-foreground">${dept.valuation.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Depreciation Schedule */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground">
            Category Depreciation & Lifespan Schedule
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">Straight-Line Depreciation Method</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Total Items</th>
                <th className="px-5 py-3.5 font-bold">Lifespan</th>
                <th className="px-5 py-3.5 font-bold">Assigned</th>
                <th className="px-5 py-3.5 font-bold">Available</th>
                <th className="px-5 py-3.5 font-bold">Est. Annual Dep.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MOCK_CATEGORIES.map((cat) => (
                <tr key={cat.name} className="transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4 font-bold text-foreground">{cat.name}</td>
                  <td className="px-5 py-4 font-semibold text-foreground">{cat.totalCount}</td>
                  <td className="px-5 py-4 text-muted-foreground font-mono">{cat.depreciationYears} Years</td>
                  <td className="px-5 py-4 text-emerald-400 font-semibold">{cat.assignedCount}</td>
                  <td className="px-5 py-4 text-sky-400 font-semibold">{cat.availableCount}</td>
                  <td className="px-5 py-4 font-mono font-bold text-amber-400">
                    ${Math.round(cat.totalCount * 120).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
