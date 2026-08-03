import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  FilePlus,
  FileLock,
  ScrollText,
  Award,
  FileCode,
  BadgeCheck,
  Search,
  Upload,
  Download,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_DOCUMENTS } from "@/lib/documents/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/documents/")({
  component: DocumentsLandingPage,
});

function DocumentsLandingPage() {
  const docNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "documents");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_DOCUMENTS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Document Uploaded", {
      description: "Encrypted and stored in OFC Document Vault.",
    });
    setIsUploadModalOpen(false);
  };

  const kpiCards = [
    { title: "Total Documents", value: "3,840", sub: "Stored in Vault", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Offer Letters", value: "124", sub: "E-Signed by Hires", icon: FilePlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Active Contracts", value: "1,248", sub: "Legally Binding", icon: FileLock, color: "text-sky-500", bg: "bg-sky-500/10" },
    { title: "Policy Handbooks", value: "18", sub: "Published 2026", icon: ScrollText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Certificates Issued", value: "480", sub: "Verified Credentials", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Digital Signatures", value: "99.2%", sub: "Audit Compliance", icon: BadgeCheck, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Enterprise Document Management & Digital Vault"
        description="Central repository for employee records, offer letters, NDAs, company policies, certificates, and e-signatures."
        breadcrumbs={[{ label: "Documents" }]}
        actions={
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Upload className="size-4" /> Upload Document
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Document Registry Table */}
      <div className="space-y-4">
        <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document title, category, owner..."
              className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{filtered.length} Documents</span>
        </div>

        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Doc ID</th>
                  <th className="px-5 py-3.5 font-bold">Document Title</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">Owner</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold">e-Sign Status</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{doc.docId}</td>
                    <td className="px-5 py-4 font-bold text-foreground">{doc.title}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.ownerName}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{doc.fileSize} ({doc.fileFormat})</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="size-3" /> {doc.eSignatureStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toast.success(`Downloading ${doc.title}`)}
                        className="glass-tile rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <Download className="size-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sub-Modules */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Document Sub-Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {docNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>

      {/* Modal Upload */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Upload Document to Vault</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Upload encrypted PDF, DOCX or image files.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDoc} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Document Title</label>
              <input type="text" required placeholder="e.g. Employee Agreement 2026" className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none" />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Category</label>
              <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer">
                <option>Employee Document</option>
                <option>Offer Letter</option>
                <option>Employment Contract</option>
                <option>Policy</option>
                <option>Certificate</option>
              </select>
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsUploadModalOpen(false)} className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold">Cancel</button>
              <button type="submit" className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">Upload File</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
