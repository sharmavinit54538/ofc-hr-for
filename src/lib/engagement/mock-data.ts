export interface RecognitionPost {
  id: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  recipientRole: string;
  badge: string;
  message: string;
  kudosCount: number;
  date: string;
}

export interface PeerReward {
  id: string;
  employeeName: string;
  pointsBalance: number;
  pointsEarnedYtd: number;
  tier: string;
}

export const MOCK_RECOGNITIONS: RecognitionPost[] = [];

export const MOCK_REWARDS: PeerReward[] = [];
