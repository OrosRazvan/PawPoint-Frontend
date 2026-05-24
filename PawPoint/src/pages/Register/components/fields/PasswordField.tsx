import { Controller, useFormContext } from "react-hook-form";
import type { RegisterFormValues } from "../../../../types/registerSchema";
import { CustomTextField } from "../CustomTextField";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const PasswordField = () => {
  const { t } = useTranslation("register");

  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={!!errors.password}
          helperText={
            errors.password?.message
              ? t(`errors.${errors.password.message as string}`)
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