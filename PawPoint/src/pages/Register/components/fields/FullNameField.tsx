import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";

const FALLBACKS_RO: Record<string, string> = {
  fullname: "Introduceți un nume complet (minim 3 caractere).",
};

export const FullNameField = () => {
  const { t, ready, i18n } = useTranslation("register", { keyPrefix: "errors" });

  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const msgKey = errors.fullname?.message as string | undefined;

  const helper =
    !msgKey
      ? ""
      : ready
        ? t(msgKey)
        : (i18n.language?.startsWith("ro") ? FALLBACKS_RO[msgKey] : msgKey) || msgKey;

  return (
    <Controller
      name="fullname"
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          label="Full Name"
          error={!!msgKey}
          helperText={helper}
        />
      )}
    />
  );
};