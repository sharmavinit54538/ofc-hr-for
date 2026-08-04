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
