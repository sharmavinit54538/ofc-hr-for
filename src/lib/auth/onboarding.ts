import { z } from "zod";

/** Zod schemas for the 5-step company onboarding wizard. */

// ── Step 1: Company Information ────────────────────────────────────
export const companyInfoSchema = z.object({
  companyLogo: z.string().optional(),
  companyName: z.string().min(2, "Enter your registered company name"),
  industry: z.string().min(1, "Select an industry"),
  companySize: z.string().min(1, "Select company size"),
  website: z
    .string()
    .optional()
    .or(z.literal("")),
  companyEmail: z
    .string()
    .trim()
    .min(1, "Company email is required")
    .email("Enter a valid email address"),
  companyPhone: z.string().min(7, "Enter a valid phone number"),
});

// ── Step 2: Company Address ────────────────────────────────────────
export const companyAddressSchema = z.object({
  country: z.string().min(1, "Select a country"),
  state: z.string().min(2, "Enter state or region"),
  city: z.string().min(2, "Enter city"),
  address: z.string().min(4, "Enter company address"),
  zipCode: z.string().min(3, "Enter a valid postal code").max(12),
  timezone: z.string().min(1, "Select a timezone"),
  currency: z.string().min(1, "Select a currency"),
  language: z.string().min(1, "Select a language"),
});

// ── Step 3: Organization Structure ─────────────────────────────────
export const orgStructureSchema = z.object({
  organizationName: z.string().min(2, "Enter organization name"),
  headOffice: z.string().min(2, "Enter head office location"),
  departments: z.array(z.string()).min(1, "Add at least one department"),
  branches: z.array(z.string()),
  designations: z.array(z.string()).min(1, "Add at least one designation"),
  employmentTypes: z.array(z.string()).min(1, "Select at least one type"),
  workingDays: z.string().min(1, "Select working days"),
  workingHours: z.string().min(1, "Enter working hours"),
});

// ── Step 4: Invite Team ────────────────────────────────────────────
export const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Enter full name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  role: z.string().min(1, "Select a role"),
});

export const inviteTeamSchema = z.object({
  members: z.array(teamMemberSchema),
});

// ── Types ──────────────────────────────────────────────────────────
export type CompanyInfoValues = z.infer<typeof companyInfoSchema>;
export type CompanyAddressValues = z.infer<typeof companyAddressSchema>;
export type OrgStructureValues = z.infer<typeof orgStructureSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type InviteTeamValues = z.infer<typeof inviteTeamSchema>;

export interface OnboardingDraft {
  companyInfo: Partial<CompanyInfoValues>;
  companyAddress: Partial<CompanyAddressValues>;
  orgStructure: Partial<OrgStructureValues>;
  teamInvites: TeamMember[];
}

// ── Stepper Steps ──────────────────────────────────────────────────
export const ONBOARDING_STEPS = [
  { id: "company-info", title: "Company", description: "Company information" },
  { id: "company-address", title: "Address", description: "Company address" },
  { id: "org-structure", title: "Structure", description: "Organization" },
  { id: "invite-team", title: "Invite", description: "Team members" },
  { id: "workspace-ready", title: "Ready", description: "All set" },
] as const;
