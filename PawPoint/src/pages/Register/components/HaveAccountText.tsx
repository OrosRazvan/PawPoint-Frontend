import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  onLoginClick: () => void;
};

export const HaveAccountText = ({ onLoginClick }: Props) => {
  const { t } = useTranslation("register");

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        {t("auth.haveAccount")}
      </Typography>

      <Typography
        onClick={onLoginClick}
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#f5a623",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {t("auth.login")}
      </Typography>
    </Stack>
  );
};