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

export function getRoleDefinition(role: Role): RoleDefinition {
  return ROLE_DEFINITIONS[role];
}

export function getLandingRoute(role: Role): string {
  return ROLE_DEFINITIONS[role].landing;
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_DEFINITIONS[role].permissions;
}
