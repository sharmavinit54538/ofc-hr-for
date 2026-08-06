import type { Permission, Role } from "./types";

export interface RoleDefinition {
  role: Role;
  label: string;
  shortLabel: string;
  description: string;
  landing: string;
  permissions: Permission[];
}

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  HR_ADMIN: {
    role: "HR_ADMIN",
    label: "HR Administrator",
    shortLabel: "HR Admin",
    description: "Full people operations control across the organization.",
    landing: "/dashboard",
    permissions: [
      "org:manage",
      "org:view",
      "people:manage",
      "people:view",
      "payroll:view",
      "security:view",
      "analytics:view",
      "team:manage",
      "self:view",
    ],
  },
  IT_ADMIN: {
    role: "IT_ADMIN",
    label: "IT Administrator",
    shortLabel: "IT Admin",
    description: "Identity, device and security administration.",
    landing: "/dashboard/it-admin",
    permissions: [
      "org:view",
      "people:view",
      "security:manage",
      "security:view",
      "devices:manage",
      "analytics:view",
      "self:view",
    ],
  },
  EXECUTIVE: {
    role: "EXECUTIVE",
    label: "Executive",
    shortLabel: "Executive",
    description: "Organization-wide workforce intelligence and planning.",
    landing: "/dashboard/executive",
    permissions: ["org:view", "people:view", "analytics:view", "self:view"],
  },
  MANAGER: {
    role: "MANAGER",
    label: "People Manager",
    shortLabel: "Manager",
    description: "Team operations, approvals and performance.",
    landing: "/dashboard/manager",
    permissions: ["people:view", "team:manage", "analytics:view", "self:view"],
  },
  EMPLOYEE: {
    role: "EMPLOYEE",
    label: "Employee",
    shortLabel: "Employee",
    description: "Personal workspace, requests and documents.",
    landing: "/dashboard/employee",
    permissions: ["self:view"],
  },
};

export const ALL_ROLES: Role[] = [
  "HR_ADMIN",
  "IT_ADMIN",
  "EXECUTIVE",
  "MANAGER",
  "EMPLOYEE",
];

export function normalizeRole(role?: string): Role {
  if (!role) return "HR_ADMIN";
  const normalized = String(role).toUpperCase().replace(/[\s_-]+/g, "_");
  if (normalized.includes("IT")) return "IT_ADMIN";
  if (normalized.includes("EXEC")) return "EXECUTIVE";
  if (normalized.includes("MANAGER")) return "MANAGER";
  if (normalized.includes("EMPLOYEE")) return "EMPLOYEE";
  return "HR_ADMIN";
}

export function getRoleDefinition(role?: string): RoleDefinition {
  const safeRole = normalizeRole(role);
  return ROLE_DEFINITIONS[safeRole];
}

export function getLandingRoute(role?: string): string {
  const safeRole = normalizeRole(role);
  return ROLE_DEFINITIONS[safeRole]?.landing || "/dashboard";
}

export function getPermissions(role?: string): Permission[] {
  const safeRole = normalizeRole(role);
  return ROLE_DEFINITIONS[safeRole]?.permissions || [];
}
