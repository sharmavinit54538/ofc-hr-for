export type JobStatus = "Active" | "Draft" | "Closed" | "Archived" | "OPEN" | "CLOSED" | "DRAFT";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary" | "Remote";

export interface Job {
  id: string;
  title: string;
  department?: string | undefined;
  employment_type?: EmploymentType | undefined;
  location?: string | undefined;
  work_mode?: string | undefined;
  salary_min?: number | undefined;
  salary_max?: number | undefined;
  salary_range?: string | undefined;
  description?: string | undefined;
  vacancies?: number | undefined;
  status: JobStatus;
  hiring_manager?: string | undefined;
  applicant_count?: number | undefined;
  applicants_count?: number | undefined;
  posted_at?: string | undefined;
  closing_at?: string | undefined;
}

export interface JobCreateInput {
  title: string;
  department?: string | undefined;
  employment_type?: EmploymentType | string | undefined;
  location?: string | undefined;
  work_mode?: string | undefined;
  salary_min?: number | undefined;
  salary_max?: number | undefined;
  salary_range?: string | undefined;
  description?: string | undefined;
  vacancies?: number | undefined;
  status?: JobStatus | string | undefined;
  hiring_manager?: string | undefined;
  closing_at?: string | undefined;
}

export interface JobUpdateInput extends Partial<JobCreateInput> {}

export type CandidateStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export type CandidateStatus = CandidateStage;

export interface Candidate {
  id: string;
  full_name: string;
  email?: string | undefined;
  phone?: string | undefined;
  job_id?: string | undefined;
  job_title?: string | undefined;
  stage: CandidateStage;
  status?: CandidateStage | undefined;
  screening_score?: number | undefined;
  score?: number | undefined;
  source?: string | undefined;
  resume_url?: string | undefined;
  applied_at?: string | undefined;
  applied_date?: string | undefined;
}

export interface CandidateCreateInput {
  full_name: string;
  email?: string | undefined;
  phone?: string | undefined;
  job_id?: string | undefined;
  stage?: CandidateStage | undefined;
  status?: CandidateStage | undefined;
  screening_score?: number | undefined;
  score?: number | undefined;
  source?: string | undefined;
  resume_url?: string | undefined;
}

export interface CandidateUpdateInput extends Partial<CandidateCreateInput> {
  screening_score?: number | undefined;
  score?: number | undefined;
  status?: CandidateStage | undefined;
}

export type InterviewStatus = "Scheduled" | "Completed" | "Cancelled" | "No-Show" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name?: string | undefined;
  interviewer_name?: string | undefined;
  job_title?: string | undefined;
  round?: string | undefined;
  round_name?: string | undefined;
  interviewer?: string | undefined;
  interviewer_id?: string | undefined;
  scheduled_at?: string | undefined;
  location_or_link?: string | undefined;
  scorecard_notes?: string | undefined;
  mode?: string | undefined;
  status: InterviewStatus;
  outcome?: string | undefined;
}

export interface InterviewCreateInput {
  candidate_id: string;
  round?: string | undefined;
  round_name?: string | undefined;
  interviewer?: string | undefined;
  interviewer_id?: string | undefined;
  scheduled_at?: string | undefined;
  location_or_link?: string | undefined;
  scorecard_notes?: string | undefined;
  mode?: string | undefined;
  status?: InterviewStatus | undefined;
}

export interface InterviewUpdateInput extends Partial<InterviewCreateInput> {
  outcome?: string | undefined;
}

export type OfferStatus =
  | "Draft"
  | "Pending Approval"
  | "Sent"
  | "Pending Signature"
  | "Accepted"
  | "Declined"
  | "Expired"
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED";

export interface Offer {
  id: string;
  candidate_id: string;
  candidate_name?: string | undefined;
  job_title?: string | undefined;
  salary?: number | undefined;
  annual_salary?: number | undefined;
  currency?: string | undefined;
  details?: string | undefined;
  status: OfferStatus;
  expires_at?: string | undefined;
  signed_at?: string | undefined;
  esign_status?: string | undefined;
}

export interface OfferCreateInput {
  candidate_id: string;
  job_title?: string | undefined;
  salary?: number | undefined;
  annual_salary?: number | undefined;
  currency?: string | undefined;
  details?: string | undefined;
  status?: OfferStatus | undefined;
  expires_at?: string | undefined;
}

export interface OfferUpdateInput extends Partial<OfferCreateInput> {
  signed_at?: string | undefined;
  esign_status?: string | undefined;
}

export interface RecruitmentReport {
  open_requisitions: number;
  total_applicants: number;
  interviews_conducted: number;
  offers_accepted: number;
  hires_this_month?: number | undefined;
  total_active_jobs?: number | undefined;
  total_candidates?: number | undefined;
  total_interviews_scheduled?: number | undefined;
  total_offers_extended?: number | undefined;
  offers_pending?: number | undefined;
}
