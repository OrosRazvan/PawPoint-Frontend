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
  rawDate?: string;
  dateUtc?: string;
  DateUtc?: string;
  scheduledDateUtc?: string;
  ScheduledDateUtc?: string;
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

export const UpcomingEventsSection = ({ events }: Props) => {
  const { t, i18n } = useTranslation("dashboard");

  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(locale);
  };

  const formatTime = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizedEvents = useMemo(() => {
    return (events ?? [])
      .map((item, index) => {
        const rawDate =
          item.dateValue ??
          item.rawDate ??
          item.scheduledDateUtc ??
          item.ScheduledDateUtc ??
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

        const rawTypeLabel =
          item.typeLabel ??
          item.title ??
          item.eventType ??
          item.type ??
          t("eventFallback");

        const normalizedType = rawTypeLabel.toLowerCase();
        const normalizedEventType = String(item.eventType ?? "").toLowerCase();

        let eventKind: "appointment" | "vaccination" | "deworming" =
          "deworming";

        if (normalizedEventType === "appointment") {
          eventKind = "appointment";
        } else if (normalizedEventType === "vaccination") {
          eventKind = "vaccination";
        } else if (normalizedEventType === "deworming") {
          eventKind = "deworming";
        } else if (
          normalizedType.includes("appointment") ||
          normalizedType.includes("consult") ||
          normalizedType.includes("program") ||
          normalizedType.includes("consulta")
        ) {
          eventKind = "appointment";
        } else if (
          normalizedType.includes("vacc") ||
          normalizedType.includes("vaccine") ||
          normalizedType.includes("vaccin") ||
          normalizedType === "vac" ||
          normalizedType.includes("combined")
        ) {
          eventKind = "vaccination";
        }

        const displayTypeLabel =
          eventKind === "appointment"
            ? t("appointmentFallback")
            : eventKind === "vaccination"
            ? t("vaccinationFallback")
            : t("dewormingFallback");

        return {
          id: String(item.id ?? index),
          petName:
            item.petName ?? item.animalName ?? item.name ?? t("petFallback"),
          typeLabel: displayTypeLabel,
          statusLabel: item.statusLabel ?? item.status ?? t("upcomingStatus"),
          rawDate,
          dateLabel: item.dateLabel ?? formatDate(rawDate),
          timeLabel: item.timeLabel ?? formatTime(rawDate),
          sortValue: Number.isNaN(parsedTime)
            ? Number.MAX_SAFE_INTEGER
            : parsedTime,
          eventKind,
        };
      })
      .filter((item) => {
        const now = Date.now();

        return (
          item.sortValue !== Number.MAX_SAFE_INTEGER &&
          item.sortValue >= now
        );
      })
      .sort((a, b) => a.sortValue - b.sortValue)
      .slice(0, 3);
  }, [events, t, locale]);

  return (
    <SectionCard title={t("upcomingEvents")}>
      {normalizedEvents.length > 0 ? (
        <Stack spacing={1.75}>
          {normalizedEvents.map((item) => {
            const isAppointment = item.eventKind === "appointment";
            const isVaccination = item.eventKind === "vaccination";

            const accentColor = isAppointment
              ? "secondary"
              : isVaccination
              ? "info"
              : "success";

            const icon = isAppointment ? (
              <CalendarMonthRoundedIcon
                sx={(theme) => ({
                  color: theme.palette.secondary.main,
                  fontSize: 20,
                })}
              />
            ) : isVaccination ? (
              <VaccinesRoundedIcon
                sx={(theme) => ({
                  color: theme.palette.info.main,
                  fontSize: 20,
                })}
              />
            ) : (
              <BugReportRoundedIcon
                sx={(theme) => ({
                  color: theme.palette.success.main,
                  fontSize: 20,
                })}
              />
            );

            return (
              <Box
                key={item.id}
                sx={(theme) => ({
                  borderRadius: 3.5,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.03)
                      : "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 2, sm: 2.25 },
                  transition: "all 0.16s ease",
                  "&:hover": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette[accentColor].main, 0.4)
                        : alpha(theme.palette[accentColor].main, 0.3),
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0,0,0,0.2)"
                        : `0 4px 20px ${alpha(
                            theme.palette[accentColor].main,
                            0.08
                          )}`,
                    transform: "translateY(-1px)",
                  },
                })}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1.5}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={(theme) => ({
                        width: { xs: 44, sm: 48 },
                        height: { xs: 44, sm: 48 },
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isAppointment
                          ? alpha(theme.palette.secondary.main, 0.12)
                          : isVaccination
                          ? alpha(theme.palette.info.main, 0.12)
                          : alpha(theme.palette.success.main, 0.12),
                        border: `1px solid ${
                          isAppointment
                            ? alpha(theme.palette.secondary.main, 0.2)
                            : isVaccination
                            ? alpha(theme.palette.info.main, 0.2)
                            : alpha(theme.palette.success.main, 0.2)
                        }`,
                        flexShrink: 0,
                      })}
                    >
                      {icon}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={(theme) => ({
                          fontSize: 15,
                          fontWeight: 700,
                          letterSpacing: "-0.2px",
                          lineHeight: 1.3,
                          color: theme.palette.text.primary,
                          wordBreak: "break-word",
                        })}
                      >
                        {t("eventForPet", {
                          type: item.typeLabel,
                          pet: item.petName,
                        })}
                      </Typography>

                      <Typography
                        sx={(theme) => ({
                          mt: 0.4,
                          fontSize: 13,
                          color: theme.palette.text.secondary,
                          fontWeight: 400,
                        })}
                      >
                        {item.dateLabel}
                        {item.timeLabel && item.timeLabel !== "—"
                          ? ` · ${item.timeLabel}`
                          : ""}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={item.statusLabel}
                    size="small"
                    sx={(theme) => ({
                      borderRadius: 999,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.06)
                          : alpha(theme.palette[accentColor].main, 0.08),
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.text.secondary
                          : theme.palette[accentColor].main,
                      fontWeight: 600,
                      fontSize: 12,
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.08)
                          : alpha(theme.palette[accentColor].main, 0.18)
                      }`,
                      alignSelf: { xs: "flex-start", sm: "center" },
                      flexShrink: 0,
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
          {t("noUpcomingEvents")}
        </Typography>
      )}
    </SectionCard>
  );
};