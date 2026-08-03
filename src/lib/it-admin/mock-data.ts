/**
 * Mock data for the IT Admin Control Plane & Identity Operations.
 * Realistic infrastructure, security, and API telemetry data.
 */

export const MOCK_SYSTEM_HEALTH = {
  cpuUsage: "18%",
  memoryUsage: "42%",
  apiLatency: "45 ms",
  uptime: "99.99%",
  activeSessions: 142,
  mfaEnforcementRate: "100%",
  blockedThreatsToday: 18,
  dbStorageUsed: "28.4 GB / 100 GB",
};

export interface IdentityProvider {
  id: string;
  name: string;
  protocol: "SAML 2.0" | "OIDC" | "OAuth 2.0";
  status: "Active" | "Inactive";
  usersCount: number;
  lastSync: string;
}

export const MOCK_SSO_PROVIDERS: IdentityProvider[] = [
  { id: "sso-01", name: "Microsoft Entra ID (Azure AD)", protocol: "OIDC", status: "Active", usersCount: 840, lastSync: "2 mins ago" },
  { id: "sso-02", name: "Okta Workforce Identity", protocol: "SAML 2.0", status: "Active", usersCount: 380, lastSync: "5 mins ago" },
  { id: "sso-03", name: "Google Workspace Directory", protocol: "OIDC", status: "Active", usersCount: 120, lastSync: "10 mins ago" },
];

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  environment: "Production" | "Staging";
  createdDate: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

export const MOCK_API_KEYS: ApiKeyRecord[] = [
  { id: "key-01", name: "Workday Payroll Integration Sync", keyPrefix: "ofc_live_9f81...", environment: "Production", createdDate: "2025-01-10", lastUsed: "Just now", status: "Active" },
  { id: "key-02", name: "Slack Notification Webhook Bot", keyPrefix: "ofc_live_3k21...", environment: "Production", createdDate: "2025-02-14", lastUsed: "12 mins ago", status: "Active" },
  { id: "key-03", name: "Staging BI Telemetry Exporter", keyPrefix: "ofc_stg_7a12...", environment: "Staging", createdDate: "2026-05-01", lastUsed: "Yesterday", status: "Active" },
];

export interface BackupSnapshot {
  id: string;
  snapshotName: string;
  size: string;
  type: "Automated Daily" | "Manual Pre-Deploy" | "Weekly Full";
  createdAt: string;
  status: "Completed" | "In Progress";
}

export const MOCK_BACKUP_SNAPSHOTS: BackupSnapshot[] = [
  { id: "bk-101", snapshotName: "snapshot-2026-08-02-daily-0000", size: "28.4 GB", type: "Automated Daily", createdAt: "Today at 00:00 IST", status: "Completed" },
  { id: "bk-102", snapshotName: "snapshot-2026-08-01-daily-0000", size: "28.2 GB", type: "Automated Daily", createdAt: "Yesterday at 00:00 IST", status: "Completed" },
  { id: "bk-103", snapshotName: "snapshot-2026-07-27-weekly-full", size: "27.8 GB", type: "Weekly Full", createdAt: "27 Jul 2026", status: "Completed" },
];
