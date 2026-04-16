import { Controller, useFormContext } from "react-hook-form";
import { CustomTextField } from "../../Login/components/CustomTextField";
import type { ResetPasswordFormValues } from "../../../types/resetPasswordSchema";

type Props = {
  name: "newPassword" | "confirmPassword";
  label: string;
  autoComplete?: string;
};

export const ResetPasswordField = ({
  name,
  label,
  autoComplete,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ResetPasswordFormValues>();

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