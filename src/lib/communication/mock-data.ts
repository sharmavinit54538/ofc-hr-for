export interface AnnouncementRecord {
  id: string;
  announcementId: string;
  title: string;
  category: string;
  author: string;
  targetAudience: string;
  publishedDate: string;
  readCount: number;
  totalRecipients: number;
  status: string;
  content: string;
}

export interface BroadcastRecord {
  id: string;
  broadcastId: string;
  subject: string;
  channel: string;
  sender: string;
  dispatchTime: string;
  deliveredCount: number;
  failedCount: number;
  status: string;
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
  status: string;
}

export interface PollRecord {
  id: string;
  pollId: string;
  question: string;
  totalVotes: number;
  options: { label: string; votes: number; percentage: number }[];
  status: string;
  endDate: string;
}

export const MOCK_ANNOUNCEMENTS: AnnouncementRecord[] = [];

export const MOCK_BROADCASTS: BroadcastRecord[] = [];

export const MOCK_SURVEYS: SurveyRecord[] = [];

export const MOCK_POLLS: PollRecord[] = [];
