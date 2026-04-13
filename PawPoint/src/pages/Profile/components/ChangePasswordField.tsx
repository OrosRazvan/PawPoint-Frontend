import { Controller, useFormContext } from "react-hook-form";
import { CustomTextField } from "../../Login/components/CustomTextField";
import type { ChangePasswordFormValues } from "../../../types/changePasswordSchema";

type Props = {
  name: "currentPassword" | "newPassword" | "confirmPassword";
  label: string;
  autoComplete?: string;
};

export const ChangePasswordField = ({
  name,
  label,
  autoComplete,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ChangePasswordFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          value={field.value ?? ""}
          label={label}
          type="password"
          autoComplete={autoComplete}
          error={!!errors[name]}
          helperText={errors[name]?.message ?? ""}
        />
      )}
    />
  );
};