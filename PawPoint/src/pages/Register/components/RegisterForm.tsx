import { LoadingButton } from "@mui/lab";
import { Stack, type TextFieldProps } from "@mui/material";
import { useTranslation } from "react-i18next";

import { EmailField } from "./fields/EmailField";
import { PasswordField } from "./fields/PasswordField";
import { ConfirmPasswordField } from "./fields/ConfirmPasswordField";
import { FullNameField } from "./fields/FullNameField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
  textFieldProps: TextFieldProps;
};

export const RegisterForm = ({
  onSubmit,
  isSubmitting,
  textFieldProps,
}: Props) => {
  const { t } = useTranslation("register");

  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2} sx={{ mt: 1 }}>
      <FullNameField {...textFieldProps} />
      <EmailField />
      <PasswordField />
      <ConfirmPasswordField />

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        sx={{
          mt: 1,
          borderRadius: 2.5,
          py: 1.4,
          px: 3,
          textTransform: "none",
          fontSize: 18,
          fontWeight: 700,
          backgroundColor: "#f5a623",
          "&:hover": { backgroundColor: "#e59412" },
          boxShadow: "none",
        }}
      >
        {t("auth.signUp")}
      </LoadingButton>
    </Stack>
  );
};