import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, CheckCircle2, AlertCircle, Upload, Search, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  useGetEmployeeDocumentsQuery,
  useUploadDocumentMutation,
} from "@/services/employeeDashboardApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/employee/documents")({
  component: EmployeeDocumentsPage,
});

function EmployeeDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Identity");

  const { data: docsRes, isLoading } = useGetEmployeeDocumentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();

  const docs = docsRes?.data ?? [];

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a document title.");
      return;
    }

    try {
      const res = await uploadDocument({
        title: title.trim(),
        category,
      }).unwrap();

      if (res.success) {
        toast.success("Document Uploaded", {
          description: `${res.data.title} submitted for HR verification.`,
        });
        setIsUploadOpen(false);
        setTitle("");
        setCategory("Identity");
      } else {
        toast.error("Upload failed", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error uploading document", {
        description: err?.data?.message || err?.message || "Server error occurred.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            My Documents & Vault
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access employment records, tax forms, ID cards, and signed agreements.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
        >
          <Upload className="size-4" /> Upload Document
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or category..."
            className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none focus:border-ring"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{filtered.length} Documents</span>
      </div>

      {/* Documents Table */}
      <div className="glass-tile overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto no-scrollbar">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              Loading employee documents...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Inbox className="size-8 text-muted-foreground/50" />
              <p className="font-medium text-foreground text-sm">No Documents Found</p>
              <p className="text-[11px] max-w-xs">
                {searchQuery
                  ? "No documents match your search criteria."
                  : "No documents available yet. Click 'Upload Document' above to upload one."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Doc ID</th>
                  <th className="px-5 py-3.5 font-bold">Document Title</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">Uploaded On</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold">Verification</th>
                  <th className="px-5 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-semibold text-primary">
                      {doc.id.length > 10 ? `DOC-${doc.id.slice(0, 6)}` : doc.id}
                    </td>
                    <td className="px-5 py-4 font-bold text-foreground flex items-center gap-2">
                      <FileText className="size-4 text-primary shrink-0" /> {doc.title}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.uploaded_on || "—"}</td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{doc.file_size}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          doc.status === "Verified"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {doc.status === "Verified" ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <AlertCircle className="size-3" />
                        )}
                        {doc.status}
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
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Upload Document</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Upload personal or employment documents for HR review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Passport Copy, Address Proof"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-card/70 px-3 py-2.5 outline-none cursor-pointer focus:border-ring"
              >
                <option>Identity</option>
                <option>Tax</option>
                <option>Financial</option>
                <option>Educational</option>
                <option>Employment</option>
                <option>Other</option>
              </select>
            </div>
            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                disabled={isUploading}
                className="glass-tile rounded-xl px-4 py-2 font-semibold hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2 font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                {isUploading && <Loader2 className="size-3.5 animate-spin" />}
                Upload File
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
