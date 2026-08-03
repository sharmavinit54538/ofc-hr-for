import { createFileRoute } from "@tanstack/react-router";
import { ReportViewLayout } from "@/components/admin/report-view-layout";
import { Contact, UserCheck, Calendar, Shield } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard/reports/employees")({
  component: EmployeeReportPage,
});

function EmployeeReportPage() {
  const kpis = (
    <>
      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Full-Time Staff</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">1,180</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">94.5% Permanent</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Contractors / Vendors</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">68</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Specialized Consultants</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Female Ratio</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">38.4%</div>
        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+4.2% Diversity Increase</p>
      </div>

      <div className="glass-tile rounded-2xl p-4">
        <span className="text-xs uppercase font-bold text-muted-foreground">Avg Tenure</span>
        <div className="font-display text-2xl font-bold text-foreground mt-2">3.4 Years</div>
        <p className="text-[10px] text-muted-foreground mt-0.5">High Retention Index</p>
      </div>
    </>
  );

  const mockEmps = [
    { employeeId: "NW-1042", name: "Aarav Sharma", department: "Product Engineering", role: "Senior AI Engineer", joiningDate: "2022-03-15", status: "Active", branch: "Bengaluru HQ" },
    { employeeId: "NW-1088", name: "Priya Patel", department: "Human Resources", role: "HR Operations Lead", joiningDate: "2023-01-10", status: "Active", branch: "Mumbai Campus" },
    { employeeId: "NW-1145", name: "Karan Verma", department: "Finance Operations", role: "Financial Analyst", joiningDate: "2023-08-01", status: "Active", branch: "Bengaluru HQ" },
    { employeeId: "NW-1180", name: "Rohan Kapoor", department: "Customer Success", role: "Account Executive", joiningDate: "2024-02-14", status: "Active", branch: "Gurugram Office" },
    { employeeId: "NW-1204", name: "Sneha Nair", department: "Product Engineering", role: "Frontend Architect", joiningDate: "2024-04-01", status: "Active", branch: "Bengaluru HQ" },
  ];

  const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "name", label: "Full Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Designation" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "branch", label: "Office Location" },
  ];

  return (
    <ReportViewLayout
      title="Employee Directory & Roster Report"
      description="Detailed workforce directory listing, employment statuses, tenure profiles, and office locations."
      categoryBadge="Employee Report"
      kpiCards={kpis}
      tableColumns={columns}
      tableData={mockEmps}
    />
  );
}
