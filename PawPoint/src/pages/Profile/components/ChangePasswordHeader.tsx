import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ChangePasswordHeader = () => {
  const { t } = useTranslation("profile");

  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          color: "#071c42",
        }}
      >
        {t("changePasswordTitle")}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: "#6b7280",
        }}
      >
        {t("changePasswordSubtitle")}
      </Typography>
    </Stack>
  );
};