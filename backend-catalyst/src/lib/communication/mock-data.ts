export interface AnnouncementRecord {
  id: string;
  announcementId: string;
  title: string;
  category: "Policy Update" | "CEO Townhall" | "Health & Safety" | "Company Event" | "General";
  author: string;
  targetAudience: string;
  publishedDate: string;
  readCount: number;
  totalRecipients: number;
  status: "Active" | "Scheduled" | "Archived";
  content: string;
}

export interface BroadcastRecord {
  id: string;
  broadcastId: string;
  subject: string;
  channel: "SMS & Email" | "Email Only" | "SMS Only" | "Push Notification";
  sender: string;
  dispatchTime: string;
  deliveredCount: number;
  failedCount: number;
  status: "Delivered" | "Sending" | "Scheduled";
}

export interface SurveyRecord {
  id: string;
  surveyId: string;
  title: string;
  department: string;
  responseRate: string;
  participantsCount: number;
  createdDate: string;
  dueDate: string;
  status: "Active" | "Closed" | "Draft";
}

export interface PollRecord {
  id: string;
  pollId: string;
  question: string;
  totalVotes: number;
  options: { label: string; votes: number; percentage: number }[];
  status: "Active" | "Closed";
  endDate: string;
}

export const MOCK_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: "anc-101",
    announcementId: "ANC-9901",
    title: "Q3 All-Hands Executive Town Hall & H2 Strategic Roadmap",
    category: "CEO Townhall",
    author: "Aarav Mehta (CHRO)",
    targetAudience: "All Northwind Employees (1,248)",
    publishedDate: "2026-08-01 09:30 AM",
    readCount: 1180,
    totalRecipients: 1248,
    status: "Active",
    content: "Join CEO Vikram Malhotra and the executive leadership team for our quarterly town hall covering H2 goals and company expansion.",
  },
  {
    id: "anc-102",
    announcementId: "ANC-9902",
    title: "Updated Remote Work & Hybrid Desk Booking Guidelines",
    category: "Policy Update",
    author: "Priya N. (Facilities)",
    targetAudience: "Engineering & IT Departments",
    publishedDate: "2026-07-28 02:00 PM",
    readCount: 840,
    totalRecipients: 850,
    status: "Active",
    content: "New guidelines for reserving hot-desking pods and hybrid work days via the OFC HR portal.",
  },
  {
    id: "anc-103",
    announcementId: "ANC-9903",
    title: "Annual Health Checkup & Wellness Benefit Enrollment",
    category: "Health & Safety",
    author: "Benefits Desk",
    targetAudience: "All Permanent Staff",
    publishedDate: "2026-07-25 11:00 AM",
    readCount: 1120,
    totalRecipients: 1180,
    status: "Active",
    content: "Free annual executive health checkups now open at Apollo & Fortis diagnostic centers.",
  },
];

export const MOCK_BROADCASTS: BroadcastRecord[] = [
  {
    id: "brd-201",
    broadcastId: "BRD-4401",
    subject: "Emergency Weather Alert: Heavy Rain Advisory Bengaluru HQ",
    channel: "SMS & Email",
    sender: "Corporate Safety Team",
    dispatchTime: "2026-08-02 08:00 AM",
    deliveredCount: 1240,
    failedCount: 8,
    status: "Delivered",
  },
  {
    id: "brd-202",
    broadcastId: "BRD-4402",
    subject: "Monthly Payslip Disbursement Notice - July 2026",
    channel: "Email Only",
    sender: "Payroll Operations",
    dispatchTime: "2026-07-31 05:00 PM",
    deliveredCount: 1248,
    failedCount: 0,
    status: "Delivered",
  },
];

export const MOCK_SURVEYS: SurveyRecord[] = [
  {
    id: "srv-301",
    surveyId: "SRV-8801",
    title: "Q3 Employee Engagement & Workplace Satisfaction Survey",
    department: "All Departments",
    responseRate: "84.2%",
    participantsCount: 1050,
    createdDate: "2026-07-15",
    dueDate: "2026-08-15",
    status: "Active",
  },
  {
    id: "srv-302",
    surveyId: "SRV-8802",
    title: "IT Provisioning & Asset Support Feedback Pulse",
    department: "Product Engineering",
    responseRate: "92.0%",
    participantsCount: 588,
    createdDate: "2026-07-20",
    dueDate: "2026-08-10",
    status: "Active",
  },
];

export const MOCK_POLLS: PollRecord[] = [
  {
    id: "pol-401",
    pollId: "POL-101",
    question: "Which topic should be featured in next month's Learning Workshop?",
    totalVotes: 840,
    options: [
      { label: "AI & LLM Agentic Workflows", votes: 420, percentage: 50 },
      { label: "Executive Leadership & Public Speaking", votes: 252, percentage: 30 },
      { label: "Financial Planning & Tax Savings", votes: 168, percentage: 20 },
    ],
    status: "Active",
    endDate: "2026-08-10",
  },
  {
    id: "pol-402",
    pollId: "POL-102",
    question: "Preferred day for Team Offsite Social Dinner?",
    totalVotes: 620,
    options: [
      { label: "Friday Evening", votes: 372, percentage: 60 },
      { label: "Saturday Afternoon", votes: 248, percentage: 40 },
    ],
    status: "Active",
    endDate: "2026-08-08",
  },
];
