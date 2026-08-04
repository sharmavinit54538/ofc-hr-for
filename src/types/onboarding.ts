export interface OnboardingWorkflowItem {
  id: string;
  title: string;
  department: string;
  total_steps: number;
  auto_trigger: string;
  is_active: boolean;
  description?: string;
}

export interface OnboardingWorkflowCreateInput {
  title: string;
  department: string;
  total_steps?: number | undefined;
  auto_trigger?: string | undefined;
  description?: string | undefined;
}

export interface NewHireItem {
  id: string;
  name: string;
  email: string;
  role_title: string;
  department: string;
  start_date: string;
  progress_percent: number;
  status: string;
  buddy_name?: string;
}

export interface NewHireCreateInput {
  name: string;
  email: string;
  role_title: string;
  department: string;
  start_date: string;
  buddy_name?: string | undefined;
}

export interface NewHireUpdateInput {
  progress_percent?: number | undefined;
  status?: string | undefined;
  buddy_name?: string | undefined;
}

export interface OnboardingDocumentItem {
  id: string;
  document_title: string;
  employee_name: string;
  employee_email: string;
  category: string;
  status: "Verified" | "Pending Review" | "Rejected";
  match_percentage: number;
  submitted_date: string;
}

export interface OnboardingDocumentCreateInput {
  document_title: string;
  employee_name: string;
  employee_email: string;
  category: string;
  match_percentage?: number | undefined;
}

export interface OnboardingDocumentUpdateInput {
  status: "Verified" | "Rejected";
}

export interface OnboardingTaskItem {
  id: string;
  task_title: string;
  assigned_to: string;
  candidate_name: string;
  status: "Completed" | "In Progress" | "Pending";
  priority: "HIGH" | "MEDIUM" | "LOW";
  due_date: string;
  tracking_info?: string;
}

export interface OnboardingTaskCreateInput {
  task_title: string;
  assigned_to: string;
  candidate_name: string;
  priority?: "HIGH" | "MEDIUM" | "LOW" | undefined;
  due_date: string;
  tracking_info?: string | undefined;
}

export interface OnboardingTaskUpdateInput {
  status?: "Completed" | "In Progress" | "Pending" | undefined;
  priority?: "HIGH" | "MEDIUM" | "LOW" | undefined;
}
