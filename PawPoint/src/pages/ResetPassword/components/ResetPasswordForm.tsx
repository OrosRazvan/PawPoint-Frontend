import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ResetPasswordField } from "./ResetPasswordField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
};

export const ResetPasswordForm = ({ onSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation("auth");

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <ResetPasswordField
        name="newPassword"
        label={t("newPassword")}
        autoComplete="new-password"
      />

      <ResetPasswordField
        name="confirmPassword"
        label={t("confirmPassword")}
        autoComplete="new-password"
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
        {t("resetPasswordButton")}
      </LoadingButton>
    </Stack>
  );
};