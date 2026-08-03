import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  SlidersHorizontal,
  Plus,
  Play,
  Save,
  Download,
  Check,
  Layers,
  Database,
  Filter,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/reports/builder")({
  component: CustomReportBuilderPage,
});

const MODULES = [
  "Workforce Directory",
  "Attendance & Time-Tracking",
  "Leave & PTO Balances",
  "Payroll & Statutory Taxes",
  "Recruitment Pipeline",
  "Onboarding Checklists",
  "Asset Management",
  "Compliance Audit",
  "AI Telemetry",
];

const AVAILABLE_FIELDS = [
  "Employee ID",
  "Full Name",
  "Work Email",
  "Department",
  "Designation",
  "Office Location",
  "Joining Date",
  "Employment Status",
  "Gross Base Pay",
  "TDS Tax Deducted",
  "Leave Balance Days",
  "Performance Rating",
  "Assigned Laptop SN",
];

function CustomReportBuilderPage() {
  const [selectedModule, setSelectedModule] = useState("Workforce Directory");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "Employee ID",
    "Full Name",
    "Department",
    "Designation",
    "Employment Status",
  ]);
  const [reportName, setReportName] = useState("Q3 Custom Workforce Report");
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      if (selectedFields.length === 1) {
        toast.error("At least one field must be selected.");
        return;
      }
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleGeneratePreview = () => {
    setIsPreviewGenerated(true);
    toast.success("Report Preview Generated", {
      description: `Showing 5 custom fields for ${selectedModule}.`,
    });
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaveModalOpen(false);
    toast.success("Custom Report Template Saved", {
      description: `"${reportName}" saved to custom report catalogue.`,
    });
  };

  const mockPreviewData = [
    { "Employee ID": "NW-1042", "Full Name": "Aarav Sharma", Department: "Product Engineering", Designation: "Senior AI Engineer", "Office Location": "Bengaluru HQ", "Joining Date": "2022-03-15", "Employment Status": "Active", "Gross Base Pay": "$12,500", "TDS Tax Deducted": "$1,850", "Leave Balance Days": "14", "Performance Rating": "4.8", "Assigned Laptop SN": "C02G4109MD6R" },
    { "Employee ID": "NW-1088", "Full Name": "Priya Patel", Department: "Human Resources", Designation: "HR Operations Lead", "Office Location": "Mumbai Campus", "Joining Date": "2023-01-10", "Employment Status": "Active", "Gross Base Pay": "$8,500", "TDS Tax Deducted": "$1,100", "Leave Balance Days": "12", "Performance Rating": "4.5", "Assigned Laptop SN": "CN-09K821" },
    { "Employee ID": "NW-1145", "Full Name": "Karan Verma", Department: "Finance Operations", Designation: "Financial Analyst", "Office Location": "Bengaluru HQ", "Joining Date": "2023-08-01", "Employment Status": "Active", "Gross Base Pay": "$9,200", "TDS Tax Deducted": "$1,250", "Leave Balance Days": "18", "Performance Rating": "4.0", "Assigned Laptop SN": "RFID-8820" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Report Builder"
        description="Power BI style interactive query builder. Select data modules, pick attributes, set filters, and export custom enterprise reports."
        breadcrumbs={[
          { label: "Reports", href: "/dashboard/reports" },
          { label: "Report Builder" },
        ]}
        backHref="/dashboard/reports"
        backLabel="Back to Reports Center"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
            >
              <Save className="size-4 text-primary" /> Save Template
            </button>
            <button
              onClick={handleGeneratePreview}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Play className="size-4" /> Run Query Preview
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Builder Controls */}
        <div className="glass-tile space-y-5 rounded-2xl p-5 lg:col-span-1">
          {/* Step 1: Select Module */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Database className="size-3.5 text-primary" /> 1. Select Data Source Module
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 text-xs outline-none cursor-pointer"
            >
              {MODULES.map((m) => (
                <option key={m} value={m} className="bg-card text-foreground">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Choose Fields */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" /> 2. Pick Report Fields ({selectedFields.length})
              </label>
            </div>

            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1.5 rounded-xl border border-border/60 bg-card/40 p-2.5 text-xs">
              {AVAILABLE_FIELDS.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleField(field)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold border border-primary/30"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{field}</span>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Filter Parameters */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="size-3.5 text-primary" /> 3. Filter Parameters
            </label>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground">Employment Status</span>
                <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer mt-0.5">
                  <option>All Active Employees</option>
                  <option>Permanent Full-Time</option>
                  <option>Contractors & Vendor Staff</option>
                  <option>Offboarded Staff</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground">Office Location</span>
                <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer mt-0.5">
                  <option>All Locations</option>
                  <option>Bengaluru HQ</option>
                  <option>Mumbai Campus</option>
                  <option>Gurugram Office</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Table Preview */}
        <div className="glass-tile space-y-4 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Eye className="size-4 text-primary" /> Live Data Table Preview
                </h3>
                <p className="text-xs text-muted-foreground">Module: {selectedModule}</p>
              </div>
              <button
                onClick={() => toast.success("Exporting Custom Query CSV")}
                className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
              >
                <Download className="size-3.5" /> Export Data
              </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                    <tr>
                      {selectedFields.map((field) => (
                        <th key={field} className="px-4 py-3 font-bold">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {mockPreviewData.map((row, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-secondary/40">
                        {selectedFields.map((field) => (
                          <td key={field} className="px-4 py-3 text-foreground font-medium whitespace-nowrap">
                            {(row as any)[field] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground pt-2">
            Showing 3 sample rows out of 1,248 matching records. Click <strong>Run Query Preview</strong> to execute full dataset.
          </div>
        </div>
      </div>

      {/* Save Template Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Save Custom Report Template</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Save current fields and filter query configuration to report catalogue.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReport} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Report Title</label>
              <input
                type="text"
                required
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Module</label>
              <input
                type="text"
                disabled
                value={selectedModule}
                className="w-full rounded-xl border border-input bg-card/40 px-3 py-2 text-muted-foreground outline-none"
              />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                Save Template
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
