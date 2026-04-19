import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../cards/SectionCard";

type RawUpcomingEvent = {
  id?: string | number;
  petName?: string;
  animalName?: string;
  name?: string;
  title?: string;
  type?: string;
  typeLabel?: string;
  eventType?: string;
  status?: string;
  statusLabel?: string;
  dateValue?: string;
  dateUtc?: string;
  DateUtc?: string;
  slotStartUtc?: string;
  SlotStartUtc?: string;
  slotStartTimeUtc?: string;
  SlotStartTimeUtc?: string;
  startTimeUtc?: string;
  StartTimeUtc?: string;
  date?: string;
  Date?: string;
  timeLabel?: string;
  dateLabel?: string;
};

type Props = {
  events: RawUpcomingEvent[];
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("ro-RO");
};

const formatTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const UpcomingEventsSection = ({ events }: Props) => {
  const { t } = useTranslation("dashboard");

  const normalizedEvents = useMemo(() => {
    return (events ?? [])
      .map((item, index) => {
        const rawDate =
          item.dateValue ??
          item.dateUtc ??
          item.DateUtc ??
          item.slotStartUtc ??
          item.SlotStartUtc ??
          item.slotStartTimeUtc ??
          item.SlotStartTimeUtc ??
          item.startTimeUtc ??
          item.StartTimeUtc ??
          item.date ??
          item.Date ??
          "";

        const parsedTime = new Date(rawDate).getTime();

        return {
          id: String(item.id ?? index),
          petName: item.petName ?? item.animalName ?? item.name ?? "Pet",
          typeLabel: item.typeLabel ?? item.title ?? item.eventType ?? item.type ?? "Event",
          statusLabel: item.statusLabel ?? item.status ?? "Upcoming",
          rawDate,
          dateLabel: item.dateLabel ?? formatDate(rawDate),
          timeLabel: item.timeLabel ?? formatTime(rawDate),
          sortValue: Number.isNaN(parsedTime) ? Number.MAX_SAFE_INTEGER : parsedTime,
        };
      })
      .filter((item) => item.sortValue !== Number.MAX_SAFE_INTEGER)
      .sort((a, b) => a.sortValue - b.sortValue)
      .slice(0, 3);
  }, [events]);

  return (
    <SectionCard title={t("upcomingEvents", "Upcoming Events")}>
      {normalizedEvents.length > 0 ? (
        <Stack spacing={2}>
          {normalizedEvents.map((item) => {
            const normalizedType = item.typeLabel.toLowerCase();

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
                key={item.id}
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
                          fontSize: 18,
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          wordBreak: "break-word",
                        })}
                      >
                        {item.typeLabel} for {item.petName}
                      </Typography>

                      <Typography
                        sx={(theme) => ({
                          mt: 1,
                          fontSize: 15,
                          color: theme.palette.text.secondary,
                        })}
                      >
                        {item.dateLabel}
                        {item.timeLabel && item.timeLabel !== "—" ? ` • ${item.timeLabel}` : ""}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={item.statusLabel}
                    sx={(theme) => ({
                      borderRadius: 999,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.06)
                          : "#f2f4f7",
                      color: theme.palette.text.secondary,
                      fontSize: 13,
                    })}
                  />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Typography
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontSize: 15,
          })}
        >
          {t("noUpcomingEvents", "No upcoming events.")}
        </Typography>
      )}
    </SectionCard>
  );
};