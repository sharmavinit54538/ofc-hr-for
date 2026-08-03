/**
 * Data structures & types for the People Manager Dashboard.
 */

export interface TeamMember {
  id: string;
  fullName: string;
  employeeId: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "On Leave" | "Remote";
  avatarBg: string;
  joiningDate: string;
  performanceRating: string;
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [];

export interface TeamLeaveApproval {
  id: string;
  employeeName: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedDate: string;
}

export const MOCK_TEAM_LEAVES: TeamLeaveApproval[] = [];

export interface TeamGoal {
  id: string;
  title: string;
  assignee: string;
  category: "Engineering" | "Design" | "Quality" | "Architecture";
  progress: number;
  dueDate: string;
  status: "On Track" | "At Risk" | "Ahead";
}

export const MOCK_TEAM_GOALS: TeamGoal[] = [];

export interface TeamOnboardingItem {
  id: string;
  newHire: string;
  role: string;
  buddy: string;
  progress: number;
  startDate: string;
  status: "In Progress" | "Completed";
}

export const MOCK_TEAM_ONBOARDING: TeamOnboardingItem[] = [];
