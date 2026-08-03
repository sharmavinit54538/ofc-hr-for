import { z } from "zod";

/** Zod schemas for the multi-step organization registration flow. */

export const organizationStepSchema = z.object({
  companyName: z.string().min(2, "Enter your registered company name"),
  logo: z.string().optional(),
  industry: z.string().min(1, "Select an industry"),
  companySize: z.string().min(1, "Select a company size"),
  website: z
    .string()
    .min(1, "Company website is required")
    .regex(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i, "Enter a valid website URL"),
  country: z.string().min(1, "Select a country"),
  timezone: z.string().min(1, "Select a timezone"),
});

export const addressStepSchema = z.object({
  address: z.string().min(4, "Enter the registered address"),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state or region"),
  zipCode: z.string().min(3, "Enter a valid postal code").max(12, "Postal code looks too long"),
  gstNumber: z
    .string()
    .max(20, "GST / VAT numbers are at most 20 characters")
    .optional()
    .or(z.literal("")),
});

export const adminStepSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().min(7, "Enter a reachable phone number"),
  avatar: z.string().optional(),
});

export const reviewStepSchema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({ message: "Accept the enterprise terms to continue" }),
  }),
  dataProcessing: z.literal(true, {
    errorMap: () => ({ message: "Confirm the data processing agreement" }),
  }),
});

export type OrganizationStepValues = z.infer<typeof organizationStepSchema>;
export type AddressStepValues = z.infer<typeof addressStepSchema>;
export type AdminStepValues = z.infer<typeof adminStepSchema>;
export type ReviewStepValues = z.infer<typeof reviewStepSchema>;

export interface RegistrationDraft
  extends Partial<OrganizationStepValues>,
    Partial<AddressStepValues>,
    Partial<AdminStepValues>,
    Partial<ReviewStepValues> {}

export const REGISTRATION_STEPS = [
  { id: "organization", title: "Organization", description: "Company profile" },
  { id: "address", title: "Address", description: "Registered office" },
  { id: "admin", title: "HR Admin", description: "First administrator" },
  { id: "review", title: "Review", description: "Confirm details" },
  { id: "done", title: "Finish", description: "Workspace ready" },
] as const;
