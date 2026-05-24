import { Controller, useFormContext } from "react-hook-form";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CustomTextField } from "../../Login/components/CustomTextField";
import type { ResetPasswordFormValues } from "../../../types/resetPasswordSchema";
import { useState } from "react";

type Props = {
  name: "newPassword" | "confirmPassword";
  label: string;
  autoComplete?: string;
};

export const ResetPasswordField = ({
  name,
  label,
  autoComplete,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext<ResetPasswordFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          value={field.value ?? ""}
          label={label}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          error={!!errors[name]}
          helperText={errors[name]?.message ?? ""}
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