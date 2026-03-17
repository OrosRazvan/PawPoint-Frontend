import { Controller, useFormContext } from "react-hook-form";
import type { LoginFormValues } from "../../../../types/loginSchema";
import { CustomTextField } from "../CustomTextField";

export const EmailField = () => {
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
          label="Email"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      )}
    />
  );
};