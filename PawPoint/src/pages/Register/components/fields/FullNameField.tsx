import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

export const FullNameField = () => {
  const { t } = useTranslation("register");

  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <Controller
      name="fullname"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label={t("auth.fullName")}
          error={!!errors.fullname}
          helperText={
            errors.fullname?.message
              ? t(`errors.${errors.fullname.message as string}`)
              : undefined
          }
        />
      )}
    />
  );
};