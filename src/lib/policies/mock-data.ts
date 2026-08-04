export interface PolicyRecord {
  id: string;
  policyId: string;
  title: string;
  category: string;
  version: string;
  effectiveDate: string;
  lastReviewed: string;
  author: string;
  acknowledgementPct: number;
  status: string;
  summary: string;
}

export const MOCK_POLICIES: PolicyRecord[] = [];
