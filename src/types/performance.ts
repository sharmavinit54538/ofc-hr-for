export type ReviewCycleType = "ANNUAL" | "QUARTERLY" | "MONTHLY" | "CUSTOM";
export type ReviewCycleStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type ReviewType = "SELF" | "MANAGER" | "PEER" | "360";
export type ReviewStatus = "PENDING" | "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type GoalType = "INDIVIDUAL" | "TEAM" | "DEPARTMENT" | "COMPANY";
export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type FeedbackType = "PRAISE" | "CONSTRUCTIVE" | "UPWARD" | "PEER";
export type CompetencyCategory = "TECHNICAL" | "SOFT" | "LEADERSHIP" | "DOMAIN";
export type ImprovementPlanStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface ReviewCycle {
  id: string;
  organization_id: string;
  name: string;
  cycle_type: ReviewCycleType;
  status: ReviewCycleStatus;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewCycleCreateInput {
  name: string;
  cycle_type?: ReviewCycleType;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface ReviewCycleUpdateInput {
  name?: string;
  cycle_type?: ReviewCycleType;
  status?: ReviewCycleStatus;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface PerformanceReview {
  id: string;
  organization_id: string;
  review_cycle_id: string;
  employee_id: string;
  employee_name?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  review_type: ReviewType;
  status: ReviewStatus;
  rating?: number;
  comments?: string;
  strengths?: string;
  areas_of_improvement?: string;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreateInput {
  review_cycle_id: string;
  employee_id: string;
  reviewer_id?: string;
  review_type?: ReviewType;
  rating?: number;
  comments?: string;
  strengths?: string;
  areas_of_improvement?: string;
}

export interface ReviewUpdateInput {
  reviewer_id?: string;
  review_type?: ReviewType;
  status?: ReviewStatus;
  rating?: number;
  comments?: string;
  strengths?: string;
  areas_of_improvement?: string;
}

export interface Goal {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name?: string;
  title: string;
  description?: string;
  goal_type: GoalType;
  status: GoalStatus;
  progress: number;
  target_date?: string;
  key_results?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalCreateInput {
  employee_id?: string;
  title: string;
  description?: string;
  goal_type?: GoalType;
  status?: GoalStatus;
  progress?: number;
  target_date?: string;
  key_results?: string;
}

export interface GoalUpdateInput {
  title?: string;
  description?: string;
  goal_type?: GoalType;
  status?: GoalStatus;
  progress?: number;
  target_date?: string;
  key_results?: string;
}

export interface FeedbackItem {
  id: string;
  organization_id: string;
  giver_id: string;
  giver_name?: string;
  receiver_id: string;
  receiver_name?: string;
  feedback_type: FeedbackType;
  content: string;
  is_public: boolean;
  badge?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackCreateInput {
  receiver_id: string;
  feedback_type?: FeedbackType;
  content: string;
  is_public?: boolean;
  badge?: string;
}

export interface FeedbackUpdateInput {
  feedback_type?: FeedbackType;
  content?: string;
  is_public?: boolean;
  badge?: string;
}

export interface CompetencyItem {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name?: string;
  skill_name: string;
  category: CompetencyCategory;
  proficiency_level: number;
  required_level: number;
  last_assessed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CompetencyCreateInput {
  employee_id?: string;
  skill_name: string;
  category?: CompetencyCategory;
  proficiency_level?: number;
  required_level?: number;
  last_assessed_at?: string;
}

export interface CompetencyUpdateInput {
  skill_name?: string;
  category?: CompetencyCategory;
  proficiency_level?: number;
  required_level?: number;
  last_assessed_at?: string;
}

export interface ImprovementPlanItem {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name?: string;
  manager_id: string;
  manager_name?: string;
  title: string;
  description?: string;
  status: ImprovementPlanStatus;
  target_date?: string;
  milestones?: string;
  created_at: string;
  updated_at: string;
}

export interface ImprovementPlanCreateInput {
  employee_id: string;
  title: string;
  description?: string;
  target_date?: string;
  milestones?: string;
}

export interface ImprovementPlanUpdateInput {
  title?: string;
  description?: string;
  status?: ImprovementPlanStatus;
  target_date?: string;
  milestones?: string;
}

export interface RatingDistributionItem {
  rating_bucket: string;
  count: number;
}

export interface DepartmentPerformanceItem {
  department: string;
  avg_rating: number;
  completed_reviews: number;
  pending_reviews: number;
}

export interface GoalCompletionItem {
  status: string;
  count: number;
}

export interface MonthlyTrendItem {
  month: string;
  avg_rating: number;
  completed_reviews: number;
}

export interface PerformanceDashboardData {
  total_reviews: number;
  completed_reviews: number;
  pending_reviews: number;
  in_progress_reviews: number;
  average_rating: number;
  overall_performance_score: number;
  goals_total: number;
  goals_completed: number;
  goals_pending: number;
  goals_in_progress: number;
  top_performers_count: number;
  low_performers_count: number;
  rating_distribution: RatingDistributionItem[];
  department_performance: DepartmentPerformanceItem[];
  goal_completion: GoalCompletionItem[];
  monthly_trend: MonthlyTrendItem[];
}
