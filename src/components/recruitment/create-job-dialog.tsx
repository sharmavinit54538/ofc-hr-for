import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateJobMutation } from "@/services/recruitmentApi";
import type { EmploymentType, JobStatus } from "@/types/recruitment";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobDialog({ open, onOpenChange }: CreateJobDialogProps) {
  const [createJob, { isLoading }] = useCreateJobMutation();

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
  });

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
      });
    } catch (err) {
      toast.error("Failed to create job requisition", {
        description: (err as { data?: { message?: string } })?.data?.message ?? "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">Create Job Requisition</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              Create Requisition
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
