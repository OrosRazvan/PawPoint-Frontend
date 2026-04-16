import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ForgotPasswordField } from "./ForgotPasswordField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
};

export const ForgotPasswordForm = ({ onSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation("auth");

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <ForgotPasswordField
        name="email"
        label={t("email")}
        autoComplete="email"
      />

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
        {t("sendResetLink")}
      </LoadingButton>
    </Stack>
  );
};