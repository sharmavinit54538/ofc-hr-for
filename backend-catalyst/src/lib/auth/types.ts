/**
 * Shared authentication domain types for the OFC HR platform.
 * Frontend-only: these describe the shape of mock enterprise data.
 */

export type Role =
  | "HR_ADMIN"
  | "IT_ADMIN"
  | "EXECUTIVE"
  | "MANAGER"
  | "EMPLOYEE";

export type Permission =
  | "org:manage"
  | "org:view"
  | "people:manage"
  | "people:view"
  | "payroll:view"
  | "security:manage"
  | "security:view"
  | "devices:manage"
  | "analytics:view"
  | "team:manage"
  | "self:view";

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string | undefined;
  industry: string;
  size: string;
  website: string;
  country: string;
  timezone: string;
  address?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  zipCode?: string | undefined;
  gstNumber?: string | undefined;
  plan: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string | undefined;
  jobTitle: string;
  department: string;
  employeeId: string;
  location: string;
}

export interface AuthUser extends UserProfile {
  role: Role;
  permissions: Permission[];
  mfaEnabled: boolean;
  lastLoginAt: string;
  lastLoginLocation: string;
}

export interface MockTokens {
  accessToken: string;
  refreshToken: string;
  issuedAt: number;
  expiresAt: number;
}

export interface DeviceSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  trusted: boolean;
}

export interface LoginAttempt {
  id: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  method: string;
  location: string;
  ip: string;
  device: string;
  reason?: string | undefined;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  resolved: boolean;
}

export interface PasswordHistoryEntry {
  id: string;
  changedAt: string;
  changedBy: string;
  method: string;
}

export interface Invitation {
  id: string;
  email: string;
  organizationName: string;
  invitedBy: string;
  role: Role;
  department: string;
  status: "pending" | "accepted" | "expired" | "invalid";
  expiresAt: string;
  sentAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  tone: "info" | "success" | "warning" | "critical";
}
