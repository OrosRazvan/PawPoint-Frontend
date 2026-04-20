import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";
import { useTranslation } from "react-i18next";

type Props = {
  petName: string;
  typeLabel: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
};

export const EventItem = ({
  petName,
  typeLabel,
  statusLabel,
  dateLabel,
  timeLabel,
}: Props) => {
  const { data: settings } = useSettings();
  const { t } = useTranslation("dashboard");

  const normalizedType = typeLabel.toLowerCase();

  const icon =
    normalizedType.includes("appointment") ? (
      <CalendarMonthRoundedIcon
        sx={(theme) => ({ color: theme.palette.secondary.main })}
      />
    ) : normalizedType.includes("vacc") ? (
      <VaccinesRoundedIcon
        sx={(theme) => ({ color: theme.palette.info.main })}
      />
    ) : (
      <BugReportRoundedIcon
        sx={(theme) => ({ color: theme.palette.success.main })}
      />
    );

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha("#ffffff", 0.03)
            : "#fff",
        px: { xs: 1.75, sm: 2.25, md: 2.5 },
        py: { xs: 1.75, sm: 2.25, md: 2.5 },
      })}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "flex-start" }}
        spacing={2}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={(theme) => ({
              width: { xs: 46, sm: 54 },
              height: { xs: 46, sm: 54 },
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                normalizedType.includes("appointment")
                  ? alpha(theme.palette.secondary.main, 0.16)
                  : normalizedType.includes("vacc")
                  ? alpha(theme.palette.info.main, 0.14)
                  : alpha(theme.palette.success.main, 0.14),
              flexShrink: 0,
            })}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(18, settings?.textSize),
                fontWeight: 800,
                color: theme.palette.text.primary,
                wordBreak: "break-word",
              })}
            >
              {t("eventForPet", { type: typeLabel, pet: petName })}
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1,
                fontSize: scaleFont(15, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {dateLabel}
              {timeLabel && timeLabel !== "—" ? ` • ${timeLabel}` : ""}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={statusLabel}
          sx={(theme) => ({
            borderRadius: 999,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha("#ffffff", 0.06)
                : "#f2f4f7",
            color: theme.palette.text.secondary,
            fontSize: scaleFont(13, settings?.textSize),
            alignSelf: { xs: "flex-start", sm: "flex-start" },
          })}
        />
      </Stack>
    </Box>
  );
};