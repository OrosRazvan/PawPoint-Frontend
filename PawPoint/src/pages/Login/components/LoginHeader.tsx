import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const LoginHeader = () => {
  const { t } = useTranslation();

  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          color: "#071c42",
        }}
      >
        {t("auth.login")}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: "#6b7280",
        }}
      >
        {t("auth.loginSubtitle")}
      </Typography>
    </Stack>
  );
};