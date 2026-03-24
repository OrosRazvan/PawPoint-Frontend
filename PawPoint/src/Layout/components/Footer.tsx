import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FooterColumn } from "./FooterColumn";

export const Footer = () => {
  const { t } = useTranslation(["layout"]);

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 4, md: 5 },
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Stack spacing={2}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "#071c42",
              }}
            >
              {t("layout:footer.aboutTitle")}
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                color: "#4c5c73",
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              {t("layout:footer.aboutText")}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn
            title={t("layout:footer.quickLinks")}
            items={[
              t("layout:footer.dashboard"),
              t("layout:footer.vaccinations"),
              t("layout:footer.appointments"),
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn
            title={t("layout:footer.support")}
            items={[
              t("layout:footer.contactUs"),
              t("layout:footer.aiAssistant"),
              t("layout:footer.helpCenter"),
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FooterColumn
            title={t("layout:footer.legal")}
            items={[
              t("layout:footer.privacyPolicy"),
              t("layout:footer.termsOfService"),
            ]}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Typography
        align="center"
        sx={{
          fontSize: 16,
          color: "#6b7280",
        }}
      >
        {t("layout:footer.copyright")}
      </Typography>
    </Box>
  );
};