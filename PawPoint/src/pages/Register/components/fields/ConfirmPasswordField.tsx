import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const ConfirmPasswordField = () => {
  const { t } = useTranslation("register");

  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword?.message
              ? t(`errors.${errors.confirmPassword.message as string}`)
              : undefined
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};