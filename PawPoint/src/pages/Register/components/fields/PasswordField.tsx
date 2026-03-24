import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const PasswordField = () => {
  const { t } = useTranslation("register");

  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={t("auth.password")}
          type="password"
          autoComplete="new-password"
          error={!!errors.password}
          helperText={
            errors.password?.message
              ? t(`errors.${errors.password.message as string}`)
              : undefined
          }
        />
      )}
    />
  );
};