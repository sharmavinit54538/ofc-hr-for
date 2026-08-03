import { Building, Hash, Landmark, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthInput } from "@/components/auth/auth-input";
import { LoadingButton } from "@/components/auth/loading-button";
import {
  addressStepSchema,
  type AddressStepValues,
  type RegistrationDraft,
} from "@/lib/auth/registration";

export function AddressStep({
  draft,
  onNext,
  onBack,
}: {
  draft: RegistrationDraft;
  onNext: (values: AddressStepValues) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues: {
      address: draft.address ?? "",
      city: draft.city ?? "",
      state: draft.state ?? "",
      zipCode: draft.zipCode ?? "",
      gstNumber: draft.gstNumber ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <AuthInput
        label="Registered address"
        placeholder="Tower B, Prism Business Park, Sector 62"
        autoComplete="street-address"
        icon={<Building className="size-4" />}
        error={errors.address?.message}
        {...register("address")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthInput
          label="City"
          placeholder="Bengaluru"
          autoComplete="address-level2"
          icon={<MapPin className="size-4" />}
          error={errors.city?.message}
          {...register("city")}
        />
        <AuthInput
          label="State / Region"
          placeholder="Karnataka"
          autoComplete="address-level1"
          icon={<MapPin className="size-4" />}
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthInput
          label="Zip / Postal code"
          placeholder="560103"
          autoComplete="postal-code"
          icon={<Hash className="size-4" />}
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
        <AuthInput
          label="GST number"
          placeholder="29AABCN1234R1ZP"
          icon={<Landmark className="size-4" />}
          hint="Optional — used for tax documents."
          error={errors.gstNumber?.message}
          {...register("gstNumber")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <LoadingButton type="button" variant="ghost" onClick={onBack}>
          Back
        </LoadingButton>
        <LoadingButton type="submit">Continue to admin</LoadingButton>
      </div>
    </form>
  );
}
