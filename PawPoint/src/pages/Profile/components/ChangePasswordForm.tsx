import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ChangePasswordField } from "./ChangePasswordField";

type Props = {
  onSubmit: () => void;
  isSubmitting: boolean;
};

export const ChangePasswordForm = ({ onSubmit, isSubmitting }: Props) => {
  const { t } = useTranslation("profile");

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <ChangePasswordField
        name="currentPassword"
        label={t("currentPassword")}
        autoComplete="current-password"
      />

      <ChangePasswordField
        name="newPassword"
        label={t("newPassword")}
        autoComplete="new-password"
      />

      <ChangePasswordField
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
        {t("changePassword")}
      </LoadingButton>
    </Stack>
  );
};