import { Controller, useFormContext } from "react-hook-form";
import type { LoginFormValues } from "../../../../types/loginSchema";
import { CustomTextField } from "../CustomTextField";

export const PasswordField = () => {
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
          label="Password"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      )}
    />
  );
};