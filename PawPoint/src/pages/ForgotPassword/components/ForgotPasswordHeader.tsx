import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ForgotPasswordHeader = () => {
  const { t } = useTranslation("auth");

  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          color: "#071c42",
        }}
      >
        {t("forgotPasswordTitle")}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        {t("forgotPasswordSubtitle")}
      </Typography>
    </Stack>
  );
};