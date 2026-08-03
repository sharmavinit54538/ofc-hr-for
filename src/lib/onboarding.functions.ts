import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const onboardingSchema = z.object({
  companyName: z.string().min(2),
  logo: z.string().optional(),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  website: z.string().min(1),
  country: z.string().min(1),
  timezone: z.string().min(1),
  address: z.string().min(4),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3).max(12),
  gstNumber: z.string().max(20).optional(),
  fullName: z.string().min(2),
  phone: z.string().min(7),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(zodValidator(onboardingSchema))
  .handler(async ({ data, context }) => {
    const { error: profileError } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        phone: data.phone,
      })
      .eq("user_id", context.userId);

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { data: company, error: companyError } = await context.supabase
      .from("companies")
      .insert({
        name: data.companyName,
        logo: data.logo ?? null,
        industry: data.industry,
        size: data.companySize,
        website: data.website,
        country: data.country,
        timezone: data.timezone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        gst_number: data.gstNumber ?? null,
        owner_id: context.userId,
      })
      .select("id, name")
      .single();

    if (companyError) {
      throw new Error(companyError.message);
    }

    return { company };
  });
