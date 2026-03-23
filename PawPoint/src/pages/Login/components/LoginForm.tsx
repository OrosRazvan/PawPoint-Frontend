import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { TextFieldProps } from "@mui/material/TextField";
import { EmailField } from "./fields/EmailField";
import { PasswordField } from "./fields/PasswordField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
  textFieldProps?: TextFieldProps;
};

export const LoginForm = ({ onSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation();

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
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {t("auth.login")}
      </LoadingButton>
    </Stack>
  );
};