import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";
import { EmailField } from "./fields/EmailField";
import { PasswordField } from "./fields/PasswordField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
  textFieldProps?: TextFieldProps;
};

export const LoginForm = ({ onSubmit, isSubmitting }: Props) => {
  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <EmailField />
      <PasswordField />

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        sx={{
          mt: 1,
          py: 1.4,
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
        }}
      >
        Login
      </LoadingButton>
    </Stack>
  );
};