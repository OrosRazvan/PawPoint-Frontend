import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { ForgotPasswordFormValues } from "../../../types/forgotPasswordSchema";

type Props = {
  name: "email";
  label: string;
  autoComplete?: string;
};

export const ForgotPasswordField = ({
  name,
  label,
  autoComplete,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ForgotPasswordFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value ?? ""}
          label={label}
          type="email"
          autoComplete={autoComplete}
          error={!!errors[name]}
          helperText={errors[name]?.message ?? ""}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
              backgroundColor: "#fffaf4",
            },
          }}
        />
      )}
    />
  );
};