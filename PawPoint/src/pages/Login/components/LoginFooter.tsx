import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const LoginFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="center"
      sx={{ mt: 3 }}
    >
      <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
        {t("auth.noAccount")}
      </Typography>

      <Typography
        onClick={() => navigate("/")}
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
        {t("auth.register")}
      </Typography>
    </Stack>
  );
};