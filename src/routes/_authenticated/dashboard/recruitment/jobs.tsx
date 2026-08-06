import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  Tag,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useDebounce } from "@/hooks/useDebounce";
import { useListJobsQuery, useListCandidatesQuery } from "@/services/recruitmentApi";
import { CreateJobDialog } from "@/components/recruitment/create-job-dialog";
import { getApiErrorMessage } from "@/utils/api-error";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/recruitment/jobs")({
  component: RecruitmentJobsPage,
});

function RecruitmentJobsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [viewingJob, setViewingJob] = useState<any | null>(null);

  const debouncedSearch = useDebounce(searchQuery);

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
    refetch,
    isFetching,
  } = useListJobsQuery({
    search: debouncedSearch || undefined,
    page: 1,
    page_size: 100,
  });

  const { data: candidatesData } = useListCandidatesQuery({
    page: 1,
    page_size: 100,
  });

  const rawJobs = useMemo(() => {
    if (!jobsData) return [];
    const d = (jobsData as any).data ?? jobsData;
    if (Array.isArray(d)) return d;
    if (Array.isArray((d as any).items)) return (d as any).items;
    if (Array.isArray((d as any).jobs)) return (d as any).jobs;
    return [];
  }, [jobsData]);

  const rawCandidates = useMemo(() => {
    if (!candidatesData) return [];
    const d = (candidatesData as any).data ?? candidatesData;
    if (Array.isArray(d)) return d;
    if (Array.isArray((d as any).items)) return (d as any).items;
    if (Array.isArray((d as any).candidates)) return (d as any).candidates;
    return [];
  }, [candidatesData]);

  // Compute real applicant count per job using candidates list
  const candidateCountsByJob = useMemo(() => {
    const counts: Record<string, number> = {};
    rawCandidates.forEach((cand: any) => {
      const jId = cand.job_id || cand.jobId;
      const jTitle = cand.job_title || cand.jobTitle || cand.current_role || cand.position;

      if (jId) {
        const idStr = String(jId);
        counts[idStr] = (counts[idStr] || 0) + 1;
      }
      if (jTitle) {
        const key = String(jTitle).toLowerCase().replace(/[^a-z0-9]/g, "").trim();
        if (key) {
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    });
    return counts;
  }, [rawCandidates]);

  const jobsList = useMemo(() => {
    return rawJobs.map((job: any) => {
      const id = job.id || job.job_id || String(Math.random());
      const title = job.title || "Job Position";
      const department = job.department || "General";
      const location = job.location || job.work_mode || "Remote";

      // Format Employment Type
      let empType = job.employment_type || "Full-Time";
      if (typeof empType === "string") {
        empType = empType.replace(/_/g, " ").toLowerCase();
        empType = empType.charAt(0).toUpperCase() + empType.slice(1);
      }

      // Calculate real applicant count
      const titleKey = title.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      const countById = candidateCountsByJob[String(id)] || 0;
      const countByTitle = candidateCountsByJob[titleKey] || 0;
      const rawCount = Number(job.applicant_count || job.applicants_count || 0);

      const applicantCount = Math.max(rawCount, countById, countByTitle);

      // Format Salary
      let salaryText = "Negotiable";
      const minSal = job.min_salary ?? job.salary_min;
      const maxSal = job.max_salary ?? job.salary_max;
      if (minSal && maxSal) {
        salaryText = `$${Number(minSal).toLocaleString()} - $${Number(maxSal).toLocaleString()}`;
      } else if (job.salary_range) {
        salaryText = job.salary_range;
      }

      // Format Date
      let dateFormatted = "—";
      const rawDate = job.created_at || job.posted_at;
      if (rawDate) {
        try {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            dateFormatted = d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }
        } catch {
          dateFormatted = String(rawDate);
        }
      }

      const vacancies = job.vacancies ?? 1;
      const status = job.status || "PUBLISHED";

      return {
        id,
        title,
        department,
        location,
        empType,
        applicantCount,
        salaryText,
        vacancies,
        status: String(status).toUpperCase(),
        dateFormatted,
        description: job.job_description || job.description || "No description provided.",
        rawObj: job,
      };
    });
  }, [rawJobs, candidateCountsByJob]);

  const availableDepts = useMemo(() => {
    const depts = new Set<string>();
    jobsList.forEach((j: any) => {
      if (j.department && j.department !== "—") depts.add(j.department);
    });
    return ["All Departments", ...Array.from(depts)];
  }, [jobsList]);

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job: any) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const match =
          job.title.toLowerCase().includes(q) ||
          job.department.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.status.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedStatus !== "All Statuses") {
        const stUpper = selectedStatus.toUpperCase();
        if (stUpper === "ACTIVE" || stUpper === "PUBLISHED" || stUpper === "OPEN") {
          if (!["ACTIVE", "PUBLISHED", "OPEN"].includes(job.status)) return false;
        } else if (!job.status.includes(stUpper)) {
          return false;
        }
      }

      if (selectedDept !== "All Departments") {
        if (job.department.toLowerCase() !== selectedDept.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [jobsList, debouncedSearch, selectedStatus, selectedDept]);

  const renderStatusBadge = (statusStr: string) => {
    const stg = statusStr.toUpperCase();
    if (stg === "PUBLISHED" || stg === "ACTIVE" || stg === "OPEN") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          <CheckCircle2 className="size-3 text-emerald-400" /> Open / Active
        </span>
      );
    }
    if (stg === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
          <Clock className="size-3 text-amber-400" /> Draft
        </span>
      );
    }
    if (stg === "CLOSED" || stg === "ARCHIVED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
          <AlertCircle className="size-3 text-rose-400" /> Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">
        {statusStr}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ────────────────────────────────────────── */}
        <PageHeader
          title="Job Requisitions"
          description="Active job openings, applicant pipelines, and hiring manager assignments."
          breadcrumbs={[{ label: "Recruitment", href: "/dashboard/recruitment" }, { label: "Job Openings" }]}
          backHref="/dashboard/recruitment"
          backLabel="Back to Recruitment"
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Plus className="size-4" /> Create Requisition
              </button>
            </div>
          }
        />

        {/* ── Search & Filter Toolbar ────────────────────────────── */}
        <div className="glass-tile flex flex-col gap-3 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, department, location, status..."
                className="w-full rounded-xl border border-input bg-card/60 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-ring focus:shadow-glow"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="glass-tile rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground">
                Total Requisitions ({filteredJobs.length})
                {isFetching && !isJobsLoading ? " · syncing…" : ""}
              </span>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
            {/* Status Filter */}
            <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs shadow-sm">
              <Filter className="mr-1.5 size-3.5 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground min-w-[140px]"
              >
                <option value="All Statuses" className="bg-card text-foreground">
                  All Statuses
                </option>
                <option value="Active" className="bg-card text-foreground">
                  Open / Active
                </option>
                <option value="Draft" className="bg-card text-foreground">
                  Draft
                </option>
                <option value="Closed" className="bg-card text-foreground">
                  Closed
                </option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="relative flex items-center rounded-xl border border-input bg-card/60 px-3 py-1.5 text-xs shadow-sm">
              <Building2 className="mr-1.5 size-3.5 text-muted-foreground" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground min-w-[150px]"
              >
                {availableDepts.map((dept) => (
                  <option key={dept} value={dept} className="bg-card text-foreground">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {(selectedStatus !== "All Statuses" || selectedDept !== "All Departments" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("All Statuses");
                  setSelectedDept("All Departments");
                  setSearchQuery("");
                }}
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── Jobs Data Table ────────────────────────────────────── */}
        <div className="glass-tile overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-card/60 uppercase tracking-[0.08em] text-muted-foreground font-bold">
                <tr>
                  <th className="px-4 py-3.5">Job Title & Position</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Type & Location</th>
                  <th className="px-4 py-3.5 text-center">Applicants</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Posted Date</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isJobsLoading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                      Loading job requisitions database…
                    </td>
                  </tr>
                )}

                {!isJobsLoading && isJobsError && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center">
                      <p className="font-semibold text-destructive">
                        {getApiErrorMessage(jobsError as FetchBaseQueryError)}
                      </p>
                      <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-3 inline-flex items-center rounded-lg border border-input px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}

                {!isJobsLoading && !isJobsError && filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                      No job requisitions found matching current filters.
                    </td>
                  </tr>
                )}

                {!isJobsLoading &&
                  !isJobsError &&
                  filteredJobs.map((job: any) => (
                    <tr key={job.id} className="transition-colors hover:bg-secondary/40">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold shadow-sm">
                            <Briefcase className="size-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{job.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {job.vacancies} {job.vacancies === 1 ? "Vacancy" : "Vacancies"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                          <Building2 className="size-3 text-muted-foreground" /> {job.department}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">{job.empType}</p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MapPin className="size-3 text-muted-foreground" /> {job.location}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary shadow-sm">
                          <Users className="size-3 text-primary" /> {job.applicantCount}{" "}
                          {job.applicantCount === 1 ? "Applicant" : "Applicants"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">{renderStatusBadge(job.status)}</td>
                      <td className="px-4 py-4 text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3 text-muted-foreground" />
                          {job.dateFormatted}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingJob(job)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 shadow-sm"
                        >
                          <Eye className="size-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── View Job Details Modal ────────────────────────────── */}
        <Dialog open={Boolean(viewingJob)} onOpenChange={(open) => !open && setViewingJob(null)}>
          <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float sm:max-w-lg">
            {viewingJob && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-primary-foreground shadow-glow">
                      <Briefcase className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                      <DialogTitle className="font-display text-xl font-bold">
                        {viewingJob.title}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        {viewingJob.department} · {viewingJob.empType}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="mt-4 space-y-3 rounded-xl border border-border/60 bg-card/40 p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" /> Department:
                    </span>
                    <span className="font-semibold text-foreground">{viewingJob.department}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" /> Location:
                    </span>
                    <span className="font-semibold text-foreground">{viewingJob.location}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <DollarSign className="size-3.5 text-primary" /> Salary Range:
                    </span>
                    <span className="font-semibold text-foreground">{viewingJob.salaryText}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" /> Active Applicants:
                    </span>
                    <span className="font-bold text-primary">{viewingJob.applicantCount} Candidate(s)</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Tag className="size-3.5 text-primary" /> Vacancies:
                    </span>
                    <span className="font-semibold text-foreground">{viewingJob.vacancies} Position(s)</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" /> Posted On:
                    </span>
                    <span className="font-semibold text-foreground">{viewingJob.dateFormatted}</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-muted-foreground font-semibold block mb-1">Description:</span>
                    <p className="text-foreground leading-relaxed bg-card/60 p-2.5 rounded-lg border border-border/40 text-[11px]">
                      {viewingJob.description}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewingJob(null)}
                    className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
                  >
                    Close Requisition
                  </button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <CreateJobDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
