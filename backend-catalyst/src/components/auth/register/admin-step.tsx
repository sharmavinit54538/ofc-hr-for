import { Mail, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthInput } from "@/components/auth/auth-input";
import { LoadingButton } from "@/components/auth/loading-button";
import { ImageUpload } from "@/components/common/image-upload";
import {
  adminStepSchema,
  type AdminStepValues,
  type RegistrationDraft,
} from "@/lib/auth/registration";

export function AdminStep({
  draft,
  onNext,
  onBack,
}: {
  draft: RegistrationDraft;
  onNext: (values: AdminStepValues) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminStepValues>({
    resolver: zodResolver(adminStepSchema),
    defaultValues: {
      fullName: draft.fullName ?? "",
      email: draft.email ?? "",
      phone: draft.phone ?? "",
      avatar: draft.avatar ?? "",
    },
  });

  const avatar = watch("avatar");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5" noValidate>
      <AuthInput
        label="Phone"
        placeholder="+91 98450 21188"
        autoComplete="tel"
        icon={<Phone className="size-4" />}
        error={errors.phone?.message}
        {...register("phone")}
      />

      <ImageUpload
        label="Profile image"
        shape="circle"
        value={avatar || undefined}
        onChange={(dataUrl) => setValue("avatar", dataUrl ?? "", { shouldDirty: true })}
        hint="Optional — helps colleagues recognise the admin account."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <LoadingButton type="button" variant="ghost" onClick={onBack}>
          Back
        </LoadingButton>
        <LoadingButton type="submit">Review details</LoadingButton>
      </div>
    </form>
  );
}
