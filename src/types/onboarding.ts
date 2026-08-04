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
