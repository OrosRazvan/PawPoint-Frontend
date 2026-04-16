import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="center"
      sx={{ mt: 3 }}
    >
      <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
        {t("backToLoginText")}
      </Typography>

      <Typography
        onClick={() => navigate("/login")}
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#f5a623",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {t("backToLogin")}
      </Typography>
    </Stack>
  );
};