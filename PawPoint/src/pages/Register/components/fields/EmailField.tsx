import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const EmailField = () => {
  const { t } = useTranslation("register", { keyPrefix: "errors" });
  const { control, formState: { errors } } = useFormContext<RegisterFormValues>();

  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label="Email"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={
            errors.email?.message ? t(errors.email.message as string) : undefined
          }
        />
      )}
    />
  );
};