import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const ConfirmPasswordField = () => {
  const { t } = useTranslation("register");

  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <Controller
      name="confirmPassword"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={t("auth.confirmPassword")}
          type="password"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword?.message
              ? t(`errors.${errors.confirmPassword.message as string}`)
              : undefined
          }
        />
      )}
    />
  );
};