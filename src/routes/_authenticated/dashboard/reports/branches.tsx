import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Building, MapPin, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports/branches")({
  component: BranchesReportPage,
});

function BranchesReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Global Offices & Campuses</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">8 Locations</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">India, SG, US, UK</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Headquarters Campus</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">Bengaluru HQ</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">720 On-site Employees</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Desk Occupancy</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">82.4%</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Hybrid Desk Sharing</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Biometric Gates Active</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">18 Terminals</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Fully Synchronized</p>
      </div>
    </>
  );

  const mockBranchData = [
    { branch: "Bengaluru Tech Park HQ", country: "India", type: "Global HQ Campus", headcount: 720, deskCapacity: 850, occupancyPct: "84.7%" },
    { branch: "Mumbai Financial Center", country: "India", type: "Regional Hub", headcount: 210, deskCapacity: 250, occupancyPct: "84.0%" },
    { branch: "Gurugram Cyber City", country: "India", type: "Regional Office", headcount: 180, deskCapacity: 200, occupancyPct: "90.0%" },
    { branch: "Singapore Marina Hub", country: "Singapore", type: "APAC HQ", headcount: 85, deskCapacity: 100, occupancyPct: "85.0%" },
    { branch: "London Tech City", country: "UK", type: "EMEA HQ", headcount: 53, deskCapacity: 70, occupancyPct: "75.7%" },
  ];

  const columns = [
    { key: "branch", label: "Campus / Office Site" },
    { key: "country", label: "Country" },
    { key: "type", label: "Facility Type" },
    { key: "headcount", label: "Assigned Headcount" },
    { key: "deskCapacity", label: "Total Desk Capacity" },
    { key: "occupancyPct", label: "Occupancy Rate" },
  ];

  return (
    <ReportViewLayout
      title="Branch & Global Campus Occupancy Report"
      description="Regional office locations, physical facility capacities, on-site headcount distribution, and desk utilization rates."
      categoryBadge="Branch Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockBranchData}
    />
  );
}
