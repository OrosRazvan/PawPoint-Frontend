import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";

export const Footer = () => {
  const { t } = useTranslation(["layout"]);
  const { data: settings } = useSettings();

  const linkSx = (theme: any) => ({
    fontSize: scaleFont(16, settings?.textSize),
    color: theme.palette.text.secondary,
    textDecoration: "none",
    width: "fit-content",
    transition: "all 0.2s ease",

    "&:hover": {
      color: theme.palette.primary.main,
      transform: "translateX(2px)",
    },
  });

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: "auto",
      })}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 5, md: 6 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 5, md: 10 }}
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(22, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  letterSpacing: "-0.3px",
                })}
              >
                PawPoint
              </Typography>

              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(16, settings?.textSize),
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  maxWidth: 320,
                })}
              >
                {t("layout:footer.aboutText")}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FooterLinks
              title={t("layout:footer.quickLinks")}
              links={[
                {
                  label: t("layout:footer.dashboard"),
                  to: "/dashboard",
                },
                {
                  label: t("layout:footer.vaccinations"),
                  to: "/vaccinations",
                },
                {
                  label: t("layout:footer.appointments"),
                  to: "/appointments",
                },
              ]}
              linkSx={linkSx}
              textSize={settings?.textSize}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FooterLinks
              title={t("layout:footer.support")}
              links={[
                {
                  label: t("layout:footer.contactUs"),
                  to: "/contact-us",
                },
                {
                  label: t("layout:footer.aiAssistant"),
                  to: "/assistant",
                },
              ]}
              linkSx={linkSx}
              textSize={settings?.textSize}
            />
          </Grid>
        </Grid>

        <Divider sx={{ opacity: 0.6, mb: 4 }} />

        <Typography
          align="center"
          sx={(theme) => ({
            fontSize: scaleFont(15, settings?.textSize),
            color: theme.palette.text.secondary,
            letterSpacing: "0.2px",
          })}
        >
          {t("layout:footer.copyright")}
        </Typography>
      </Box>
    </Box>
  );
};

type FooterLinksProps = {
  title: string;
  links: {
    label: string;
    to: string;
  }[];
  linkSx: (theme: any) => object;
  textSize?: string;
};

const FooterLinks = ({
  title,
  links,
  linkSx,
  textSize,
}: FooterLinksProps) => {
  return (
    <Stack spacing={2.5}>
      <Typography
        sx={(theme) => ({
          fontSize: scaleFont(20, textSize),
          fontWeight: 700,
          color: theme.palette.text.primary,
        })}
      >
        {title}
      </Typography>

      <Stack spacing={1.8}>
        {links.map((link) => (
          <Typography
            key={link.to}
            component={Link}
            to={link.to}
            sx={linkSx}
          >
            {link.label}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};