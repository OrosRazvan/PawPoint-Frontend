import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const ConfirmPasswordField = () => {
  const { t } = useTranslation("register", { keyPrefix: "errors" });
  const { control, formState: { errors } } = useFormContext<RegisterFormValues>();

  return (
    <Controller
      name="confirmPassword"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword?.message ? t(errors.confirmPassword.message as string) : undefined
          }
        />
      )}
    />
  );
};