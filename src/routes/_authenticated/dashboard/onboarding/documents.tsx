import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import {
  useListOnboardingDocumentsQuery,
  useCreateOnboardingDocumentMutation,
  useUpdateOnboardingDocumentStatusMutation,
  useDeleteOnboardingDocumentMutation,
} from "@/services/authApi";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Inbox,
  Filter,
  Search,
  ShieldCheck,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/onboarding/documents")({
  component: OnboardingDocumentsPage,
});

function OnboardingDocumentsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [docTitle, setDocTitle] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [category, setCategory] = useState("Identity Proof");
  const [matchPercentage, setMatchPercentage] = useState(100);

  // API Hooks
  const queryArgs: { status?: string; search?: string } = {};
  if (statusFilter) queryArgs.status = statusFilter;
  if (search) queryArgs.search = search;

  const { data: docsRes, isLoading, isError, refetch } = useListOnboardingDocumentsQuery(
    Object.keys(queryArgs).length > 0 ? queryArgs : undefined
  );
  const [createDoc, { isLoading: isUploading }] = useCreateOnboardingDocumentMutation();
  const [updateDocStatus] = useUpdateOnboardingDocumentStatusMutation();
  const [deleteDoc] = useDeleteOnboardingDocumentMutation();

  const docs = docsRes?.data ?? [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !employeeName || !employeeEmail) {
      toast.error("Please enter document title, candidate name, and email.");
      return;
    }

    try {
      await createDoc({
        document_title: docTitle,
        employee_name: employeeName,
        employee_email: employeeEmail,
        category,
        match_percentage: matchPercentage,
      }).unwrap();

      toast.success("Verification document registered successfully.");
      setIsModalOpen(false);
      setDocTitle("");
      setEmployeeName("");
      setEmployeeEmail("");
    } catch {
      toast.error("Failed to upload document.");
    }
  };

  const handleStatusAction = async (id: string, status: "Verified" | "Rejected") => {
    try {
      await updateDocStatus({
        id,
        body: { status },
      }).unwrap();
      toast.success(`Document marked as ${status.toLowerCase()}.`);
    } catch {
      toast.error("Failed to update document status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document record?")) return;
    try {
      await deleteDoc(id).unwrap();
      toast.success("Document record deleted.");
    } catch {
      toast.error("Failed to delete document.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "VERIFIED":
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">Verified</span>;
      case "REJECTED":
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-500">Rejected</span>;
      default:
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Verification Vault"
        description="Collection, OCR verification, and audit signoff for government IDs, tax filings, and educational transcripts stored in PostgreSQL."
        breadcrumbs={[
          { label: "Onboarding", href: "/dashboard/onboarding" },
          { label: "Document Vault" },
        ]}
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Plus className="size-4" /> Upload Verification Document
          </button>
        }
      />

      {/* ── Toolbar ── */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, document title, or category..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" /> Filter Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-card/60 py-1.5 px-3 text-xs text-foreground outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ── Content Area / Table ── */}
      {isLoading ? (
        <div className="glass-tile h-64 animate-pulse rounded-2xl p-6" />
      ) : isError ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <h3 className="mt-3 font-display text-base font-bold text-foreground">
            Failed to load verification documents
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            An error occurred while fetching document records from PostgreSQL.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </div>
      ) : docs.length === 0 ? (
        <div className="glass-tile flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-foreground">
            No verification documents found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No documents match your search or filter. Click below to register one.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Upload Verification Document
          </button>
        </div>
      ) : (
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-card/80 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5 pl-5">Document & Applicant</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">OCR / Identity Match</th>
                  <th className="p-3.5">Submission Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-card/40 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <FileText className="size-4 text-primary shrink-0" /> {doc.document_title}
                      </div>
                      <div className="text-[11px] text-muted-foreground pl-5">
                        {doc.employee_name} ({doc.employee_email})
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                        {doc.match_percentage}% Confidence Match
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">{doc.submitted_date}</td>
                    <td className="p-3.5">{getStatusBadge(doc.status)}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {doc.status.toUpperCase() === "PENDING REVIEW" && (
                          <>
                            <button
                              onClick={() => handleStatusAction(doc.id, "Verified")}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                              title="Verify Document"
                            >
                              <CheckCircle2 className="size-3" /> Verify
                            </button>
                            <button
                              onClick={() => handleStatusAction(doc.id, "Rejected")}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/20"
                              title="Reject Document"
                            >
                              <XCircle className="size-3" /> Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Upload Verification Document Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-tile w-full max-w-md rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Register Verification Document
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Passport & Identity Proof"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Candidate / Employee Name</label>
                <input
                  type="text"
                  required
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="e.g. Arjun Gupta"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Candidate Email</label>
                <input
                  type="email"
                  required
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  placeholder="e.g. arjun.gupta@company.com"
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="Identity Proof">Identity Proof (Passport/SSN/PAN)</option>
                    <option value="Tax Filing">Tax Filing (Form W-4/16)</option>
                    <option value="Educational Transcript">Educational Transcript</option>
                    <option value="Relieving Letter">Relieving / Experience Letter</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Match Confidence (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={matchPercentage}
                    onChange={(e) => setMatchPercentage(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  {isUploading ? "Saving..." : "Register Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
