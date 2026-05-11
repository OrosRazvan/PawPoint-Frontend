import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";

export const RegisterHeader = () => {
  const { t } = useTranslation("register");

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            component="img"
            src={new URL("../assets/logo.jpg", import.meta.url).toString()}
            alt="Logo"
            sx={{
              width: 56,
              height: 56,
              objectFit: "contain",
              display: "block",
            }}
          />
        </Stack>

        <LanguageSwitcher />
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