import { LoadingButton } from "@mui/lab";
import { Stack, type TextFieldProps } from "@mui/material";

import { EmailField } from "./fields/EmailField";
import { PasswordField } from "./fields/PasswordField";
import { ConfirmPasswordField } from "./fields/ConfirmPasswordField";
import { FullNameField } from "./fields/FullNameField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
  textFieldProps: TextFieldProps
};


export const RegisterForm = ({ onSubmit, isSubmitting, textFieldProps }: Props) => {
  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2.0} sx={{ mt: 1 }}>
      <FullNameField {...textFieldProps} />
      <EmailField />
      <PasswordField />
      <ConfirmPasswordField />

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        sx={{
          mt: 0.5,
          alignSelf: "center",
          borderRadius: 2,
          px: 3,
          textTransform: "none",
          fontWeight: 700,
          backgroundColor: "#f5a623", 
          "&:hover": { backgroundColor: "#e59412" },
          boxShadow: "none",
        }}
      >
        Sign Up
      </LoadingButton>
    </Stack>
  );
};