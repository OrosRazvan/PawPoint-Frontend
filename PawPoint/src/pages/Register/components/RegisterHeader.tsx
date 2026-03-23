import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const RegisterHeader = () => {
  const { t } = useTranslation("register");

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          component="img"
          src={new URL("../assets/logo.svg", import.meta.url).toString()}
          alt="Logo"
          sx={{ width: 28, height: 28 }}
        />
        <Typography sx={{ fontWeight: 800 }}>{t("auth.brand")}</Typography>
      </Stack>

      <Stack spacing={0.5}>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          {t("auth.signUp")}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 15 }}>
          {t("auth.registerSubtitle")}
        </Typography>
      </Stack>
    </Stack>
  );
};