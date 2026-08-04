/**
 * Mock data for the IT Admin Control Plane & Identity Operations.
 * Realistic infrastructure, security, and API telemetry data.
 */

export const MOCK_SYSTEM_HEALTH = {
  cpuUsage: "0%",
  memoryUsage: "0%",
  apiLatency: "0 ms",
  uptime: "100%",
  activeSessions: 0,
  mfaEnforcementRate: "100%",
  blockedThreatsToday: 0,
  dbStorageUsed: "0 GB",
};

export interface IdentityProvider {
  id: string;
  name: string;
  protocol: "SAML 2.0" | "OIDC" | "OAuth 2.0";
  status: "Active" | "Inactive";
  usersCount: number;
  lastSync: string;
}

export const MOCK_SSO_PROVIDERS: IdentityProvider[] = [];

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  environment: "Production" | "Staging";
  createdDate: string;
  lastUsed: string;
  status: "Active" | "Revoked";
}

export const MOCK_API_KEYS: ApiKeyRecord[] = [];

export interface BackupSnapshot {
  id: string;
  snapshotName: string;
  size: string;
  type: "Automated Daily" | "Manual Pre-Deploy" | "Weekly Full";
  createdAt: string;
  status: "Completed" | "In Progress";
}

export const MOCK_BACKUP_SNAPSHOTS: BackupSnapshot[] = [];
