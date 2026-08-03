import { Building2, Globe, Clock, MapPin, Users2, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSelect } from "@/components/auth/auth-select";
import { ImageUpload } from "@/components/common/image-upload";
import { LoadingButton } from "@/components/auth/loading-button";
const COMPANY_SIZES = ["1 - 10", "11 - 50", "51 - 200", "201 - 500", "501 - 1000", "1000+"];
const COUNTRIES = ["India", "United States", "United Kingdom", "Singapore", "United Arab Emirates", "Canada", "Australia"];
const INDUSTRIES = ["Technology & Software", "Financial Services", "Manufacturing & Industrial", "Healthcare & Pharma", "Retail & E-commerce", "Professional Services"];
const TIMEZONES = ["Asia/Kolkata (GMT+5:30)", "UTC (GMT+0)", "America/New_York (GMT-5)", "America/Los_Angeles (GMT-8)", "Europe/London (GMT+0)", "Asia/Singapore (GMT+8)"];

import {
  organizationStepSchema,
  type OrganizationStepValues,
  type RegistrationDraft,
} from "@/lib/auth/registration";

export function OrganizationStep({
  draft,
  onNext,
}: {
  draft: RegistrationDraft;
  onNext: (values: OrganizationStepValues) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizationStepValues>({
    resolver: zodResolver(organizationStepSchema),
    defaultValues: {
      companyName: draft.companyName ?? "",
      logo: draft.logo ?? "",
      industry: draft.industry ?? "",
      companySize: draft.companySize ?? "",
      website: draft.website ?? "",
      country: draft.country ?? "",
      timezone: draft.timezone ?? "",
    },
  });

  const logo = watch("logo");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <AuthInput
        label="Company name"
        placeholder="Northwind Industries"
        autoComplete="organization"
        icon={<Building2 className="size-4" />}
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <ImageUpload
        label="Company logo"
        shape="square"
        value={logo || undefined}
        onChange={(dataUrl) => setValue("logo", dataUrl ?? "", { shouldDirty: true })}
        hint="Square PNG or SVG works best. Optional."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthSelect
          label="Industry"
          options={INDUSTRIES}
          placeholder="Select industry"
          icon={<Briefcase className="size-4" />}
          error={errors.industry?.message}
          {...register("industry")}
        />
        <AuthSelect
          label="Company size"
          options={COMPANY_SIZES}
          placeholder="Select size"
          icon={<Users2 className="size-4" />}
          error={errors.companySize?.message}
          {...register("companySize")}
        />
      </div>

      <AuthInput
        label="Website"
        placeholder="https://northwind.com"
        autoComplete="url"
        icon={<Globe className="size-4" />}
        error={errors.website?.message}
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthSelect
          label="Country"
          options={COUNTRIES}
          placeholder="Select country"
          icon={<MapPin className="size-4" />}
          error={errors.country?.message}
          {...register("country")}
        />
        <AuthSelect
          label="Timezone"
          options={TIMEZONES}
          placeholder="Select timezone"
          icon={<Clock className="size-4" />}
          error={errors.timezone?.message}
          {...register("timezone")}
        />
      </div>

      <LoadingButton type="submit">Continue to address</LoadingButton>
    </form>
  );
}
