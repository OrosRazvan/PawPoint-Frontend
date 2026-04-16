import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { FooterColumn } from "./FooterColumn";

export const Footer = () => {
  const { t } = useTranslation(["layout"]);
  const { data: settings } = useSettings();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        mt: 4,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 4, md: 5 },
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Stack spacing={2}>
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(20, settings?.textSize),
                fontWeight: 700,
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:footer.aboutTitle")}
            </Typography>

            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(16, settings?.textSize),
                color: theme.palette.text.secondary,
                maxWidth: 280,
                lineHeight: 1.6,
              })}
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
        sx={(theme) => ({
          fontSize: scaleFont(16, settings?.textSize),
          color: theme.palette.text.secondary,
        })}
      >
        {t("layout:footer.copyright")}
      </Typography>
    </Box>
  );
};