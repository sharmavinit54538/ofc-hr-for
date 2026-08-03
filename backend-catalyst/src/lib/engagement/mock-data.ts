export interface RecognitionPost {
  id: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  recipientRole: string;
  badge: "Innovation Star" | "Team Player" | "Customer Champion" | "Leadership Award" | "Above & Beyond";
  message: string;
  kudosCount: number;
  date: string;
}

export interface PeerReward {
  id: string;
  employeeName: string;
  pointsBalance: number;
  pointsEarnedYtd: number;
  tier: "Gold Star" | "Silver Star" | "Bronze Star";
}

export const MOCK_RECOGNITIONS: RecognitionPost[] = [
  {
    id: "rec-101",
    senderName: "Aarav Mehta (CHRO)",
    senderRole: "Chief Human Resources Officer",
    recipientName: "Aarav Sharma",
    recipientRole: "Senior AI Engineer",
    badge: "Innovation Star",
    message: "Incredible work building the autonomous AI onboarding assistant! Saved over 120 manual HR hours this month.",
    kudosCount: 42,
    date: "2026-08-01",
  },
  {
    id: "rec-102",
    senderName: "Anurag Kashyap",
    senderRole: "VP Engineering",
    recipientName: "Priya Patel",
    recipientRole: "HR Operations Lead",
    badge: "Team Player",
    message: "huge shoutout for seamlessly coordinating the Singapore R&D office team transition!",
    kudosCount: 28,
    date: "2026-07-29",
  },
];

export const MOCK_REWARDS: PeerReward[] = [
  { id: "rwd-1", employeeName: "Aarav Sharma", pointsBalance: 1250, pointsEarnedYtd: 3400, tier: "Gold Star" },
  { id: "rwd-2", employeeName: "Priya Patel", pointsBalance: 980, pointsEarnedYtd: 2800, tier: "Gold Star" },
  { id: "rwd-3", employeeName: "Karan Verma", pointsBalance: 640, pointsEarnedYtd: 1800, tier: "Silver Star" },
];
