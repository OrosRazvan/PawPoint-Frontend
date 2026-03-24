import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { LoginFormValues } from "../../../../types/loginSchema";
import { CustomTextField } from "../CustomTextField";

export const PasswordField = () => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext<LoginFormValues>();

  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={t("auth.password")}
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      )}
    />
  );
};