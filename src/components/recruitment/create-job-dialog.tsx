import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateJobMutation,
  useGenerateJobDescriptionMutation,
  useAiAutofillJobMutation,
} from "@/services/recruitmentApi";
import { getApiErrorMessage } from "@/utils/api-error";
import type { EmploymentType, JobStatus } from "@/types/recruitment";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobDialog({ open, onOpenChange }: CreateJobDialogProps) {
  const [createJob, { isLoading: isSubmitting }] = useCreateJobMutation();
  const [generateJobDescription, { isLoading: isGeneratingJd }] = useGenerateJobDescriptionMutation();
  const [aiAutofillJob, { isLoading: isAutofilling }] = useAiAutofillJobMutation();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employment_type: "Full-time" as EmploymentType,
    location: "",
    work_mode: "Hybrid",
    salary_min: "",
    salary_max: "",
    vacancies: "1",
    status: "Active" as JobStatus,
    description: "",
  });

  /** Call backend API: POST /api/v1/recruitment/jobs/generate-description */
  const handleGenerateAiJd = async () => {
    if (!formData.title.trim()) {
      toast.error("Job Title Required", {
        description: "Please enter a Job Title first so the backend AI can generate the JD.",
      });
      return;
    }

    try {
      const res = await generateJobDescription({
        title: formData.title,
        department: formData.department || undefined,
        employment_type: formData.employment_type || undefined,
        location: formData.location || undefined,
      }).unwrap();

      const textData = (res as any)?.data ?? res;
      if (typeof textData === "string" && textData) {
        setFormData((prev) => ({ ...prev, description: textData }));
        toast.success("AI Job Description Generated", {
          description: `Fetched live AI job description for "${formData.title}" from backend server API.`,
        });
      } else {
        toast.error("Invalid Response", {
          description: "Backend returned an empty job description.",
        });
      }
    } catch (err) {
      toast.error("Backend AI Error", {
        description: getApiErrorMessage(err, "Failed to generate AI job description from backend API."),
      });
    }
  };

  /** Call backend API: POST /api/v1/recruitment/jobs/ai-autofill */
  const handleAiAutofill = async () => {
    if (!formData.title.trim()) {
      toast.error("Job Title Required", {
        description: "Please enter a Job Title to trigger 1-click AI form auto-fill.",
      });
      return;
    }

    try {
      const res = await aiAutofillJob({
        title: formData.title,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
      }).unwrap();

      const autofill = (res as any)?.data ?? res;
      if (autofill) {
        setFormData((prev) => ({
          ...prev,
          department: autofill.department || prev.department,
          employment_type: (autofill.employment_type as EmploymentType) || prev.employment_type,
          location: autofill.location || prev.location,
          work_mode: autofill.work_mode || prev.work_mode,
          vacancies: autofill.vacancies ? String(autofill.vacancies) : prev.vacancies,
          description: autofill.description || prev.description,
        }));
        toast.success("AI Auto-Fill Completed!", {
          description: `Form auto-filled with AI recommendations for "${formData.title}".`,
        });
      }
    } catch (err) {
      toast.error("Backend AI Error", {
        description: getApiErrorMessage(err, "Failed to auto-fill job fields from backend API."),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Job title is required.");
      return;
    }

    try {
      await createJob({
        title: formData.title,
        department: formData.department || undefined,
        employment_type: formData.employment_type,
        location: formData.location || undefined,
        work_mode: formData.work_mode || undefined,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        vacancies: formData.vacancies ? Number(formData.vacancies) : undefined,
        status: formData.status,
        description: formData.description || undefined,
      }).unwrap();

      toast.success("Job Requisition Created", {
        description: `Successfully posted ${formData.title}.`,
      });
      onOpenChange(false);
      setFormData({
        title: "",
        department: "",
        employment_type: "Full-time",
        location: "",
        work_mode: "Hybrid",
        salary_min: "",
        salary_max: "",
        vacancies: "1",
        status: "Active",
        description: "",
      });
    } catch (err) {
      toast.error("Failed to create job requisition", {
        description: getApiErrorMessage(err, "An unexpected error occurred while posting requisition."),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-display text-lg font-bold">Create Job Requisition</DialogTitle>
                <p className="text-xs text-muted-foreground">Post job opening with backend AI Job Description generator.</p>
              </div>
            </div>
            {formData.title.trim() && (
              <button
                type="button"
                onClick={handleAiAutofill}
                disabled={isAutofilling}
                className="relative inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-sm transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-500/60 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isAutofilling ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Auto-Filling...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-3.5 text-indigo-400" />
                    <span>AI Auto-Fill Form</span>
                  </>
                )}
              </button>
            )}
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
          <div>
            <label className="block font-semibold mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Fullstack Engineer"
              className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Engineering"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Employment Type</label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as EmploymentType })}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Work Mode</label>
              <select
                value={formData.work_mode}
                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Min Salary ($)</label>
              <input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                placeholder="e.g. 100000"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Max Salary ($)</label>
              <input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                placeholder="e.g. 140000"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Vacancies</label>
              <input
                type="number"
                min="1"
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* AI Job Description Section */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                Job Description (JD)
              </label>
              <button
                type="button"
                onClick={handleGenerateAiJd}
                disabled={isGeneratingJd}
                className="relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {isGeneratingJd ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Generating JD...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Generate JD with AI</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter or generate complete job description via backend AI endpoint..."
              className="w-full rounded-xl border border-input bg-card px-3 py-2 outline-none focus:border-primary text-xs leading-relaxed"
            />
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isGeneratingJd || isAutofilling}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              Create Requisition
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
