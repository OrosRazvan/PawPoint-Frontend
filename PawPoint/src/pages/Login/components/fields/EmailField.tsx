import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { LoginFormValues } from "../../../../types/loginSchema";
import { CustomTextField } from "../CustomTextField";

export const EmailField = () => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext<LoginFormValues>();

  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      )}
    />
  );
};