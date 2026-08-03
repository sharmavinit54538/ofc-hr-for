export interface ApprovalItem {
  id: string;
  approvalId: string;
  type: "Leave" | "Attendance" | "Payroll" | "Recruitment" | "Onboarding" | "Assets" | "Expenses" | "Promotions" | "Transfers" | "Resignations" | "Overtime" | "Training";
  requestTitle: string;
  requesterName: string;
  requesterDept: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  submittedDate: string;
  assignedApprover: string;
  amountOrDays?: string;
  status: "Pending" | "Approved" | "Rejected" | "Changes Requested";
  comments?: string;
}

export const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: "app-101",
    approvalId: "APR-8801",
    type: "Leave",
    requestTitle: "Earned Vacation Leave (5 Days)",
    requesterName: "Aarav Sharma",
    requesterDept: "Product Engineering",
    priority: "Medium",
    submittedDate: "2026-08-01 10:30 AM",
    assignedApprover: "Anurag K. (VP Eng)",
    amountOrDays: "5 Days (Aug 10 - Aug 14)",
    status: "Pending",
  },
  {
    id: "app-102",
    approvalId: "APR-8802",
    type: "Expenses",
    requestTitle: "Client Onsite Travel & Airfare Reimbursement",
    requesterName: "Priya Patel",
    requesterDept: "Human Resources",
    priority: "High",
    submittedDate: "2026-07-30 04:15 PM",
    assignedApprover: "Karan Verma (Finance)",
    amountOrDays: "$1,450.00",
    status: "Pending",
  },
  {
    id: "app-103",
    approvalId: "APR-8803",
    type: "Assets",
    requestTitle: 'MacBook Pro 16" M3 Max Hardware Requisition',
    requesterName: "Rohan Kapoor",
    requesterDept: "Product Engineering",
    priority: "Urgent",
    submittedDate: "2026-08-02 08:00 AM",
    assignedApprover: "Priya N. (IT)",
    amountOrDays: "1 Unit",
    status: "Pending",
  },
  {
    id: "app-104",
    approvalId: "APR-8804",
    type: "Promotions",
    requestTitle: "H2 Merit Promotion: Senior AI Engineer to Principal Lead",
    requesterName: "Vikram Sharma",
    requesterDept: "Product Engineering",
    priority: "High",
    submittedDate: "2026-07-25 11:00 AM",
    assignedApprover: "Meera K. (CHRO)",
    amountOrDays: "+18% Band Hike",
    status: "Approved",
    comments: "Approved based on Q2 LLM agentic project execution excellence.",
  },
  {
    id: "app-105",
    approvalId: "APR-8805",
    type: "Overtime",
    requestTitle: "Weekend Infrastructure Migration OT Payout (18.5 Hrs)",
    requesterName: "Sanjay Gupta",
    requesterDept: "Information Technology",
    priority: "Medium",
    submittedDate: "2026-07-28 05:00 PM",
    assignedApprover: "Priya N. (IT Admin)",
    amountOrDays: "18.5 Hrs ($720)",
    status: "Approved",
  },
];
