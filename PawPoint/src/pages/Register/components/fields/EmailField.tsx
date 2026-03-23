import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const EmailField = () => {
  const { t } = useTranslation("register");

  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

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
          helperText={
            errors.email?.message
              ? t(`errors.${errors.email.message as string}`)
              : undefined
          }
        />
      )}
    />
  );
};