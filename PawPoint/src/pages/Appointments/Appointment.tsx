import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckIcon from "@mui/icons-material/Check";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppointments } from "../../hooks/useAppointments";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { AppointmentCard } from "./components/AppointmentCard";
import {
  CompletedPeriodFilter,
  type CompletedFilterMonths,
} from "../../components/CompletedPeriodFilter";
import { filterCompletedByPeriod } from "../../utils/completedPeriodFilter";
import type { AppointmentCardItem, AppointmentDto } from "./types/appointment";

const resolveStatus = (item: AppointmentDto): "completed" | "upcoming" => {
  const slotValue = item.slotStartTimeUtc ?? item.startTimeUtc ?? "";
  const slotDate = new Date(slotValue).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapAppointments = (
  items: AppointmentDto[],
  t: (key: string) => string
): AppointmentCardItem[] => {
  return items.map((item) => ({
    id: item.id,
    animalId: item.animalId,
    animalName: item.animalName ?? t("appointment:petFallback"),
    serviceType: item.serviceType ?? t("appointment:serviceFallback"),
    vetCabinetId: item.vetCabinetId,
    vetCabinetName: item.vetCabinetName ?? t("appointment:clinicFallback"),
    vetCabinetAddress: item.vetCabinetAddress ?? null,
    vetTimeSlotId: item.vetTimeSlotId,
    slotStartTimeUtc: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
    slotEndTimeUtc: item.slotEndTimeUtc ?? item.endTimeUtc ?? "",
    vetDoctorName: item.vetDoctorName ?? null,
    price: item.price ?? null,
    currency: item.currency,
    notes: item.notes ?? null,
    status: resolveStatus({
      ...item,
      slotStartTimeUtc: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
    } as AppointmentDto),
  }));
};

export const Appointments = () => {
  const { t } = useTranslation(["appointment"]);
  const navigate = useNavigate();
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useAppointments();

  const [completedFilterMonths, setCompletedFilterMonths] =
    useState<CompletedFilterMonths>(3);

  const items = useMemo(() => mapAppointments(data, t), [data, t]);

  const completedItems = useMemo(
    () => items.filter((item) => item.status === "completed"),
    [items]
  );

  const upcomingItems = useMemo(
    () => items.filter((item) => item.status === "upcoming"),
    [items]
  );

  const filteredCompletedItems = useMemo(
    () => filterCompletedByPeriod(completedItems, completedFilterMonths),
    [completedItems, completedFilterMonths]
  );

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      })}
    >
      <Stack spacing={5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 52,
                height: 52,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.32
                )}`,
                flexShrink: 0,
              })}
            >
              <EventAvailableOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Box>
              <Typography
                sx={(theme) => ({
                  fontSize: {
                    xs: scaleFont(28, settings?.textSize),
                    md: scaleFont(34, settings?.textSize),
                  },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: theme.palette.text.primary,
                  letterSpacing: "-0.5px",
                })}
              >
                {t("appointment:title")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {t("appointment:subtitle")}
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => navigate("/appointments/book")}
            sx={(theme) => ({
              px: 2.75,
              py: 1.25,
              borderRadius: 2.5,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              fontSize: scaleFont(14, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.1px",
              whiteSpace: "nowrap",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? `0 6px 18px ${alpha(theme.palette.primary.main, 0.28)}`
                  : `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              },
            })}
          >
            {t("appointment:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("appointment:loadError")}</Typography>
        ) : (
          <Stack spacing={5}>
            {upcomingItems.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Box
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.warning.main, 0.16)
                          : "#fef3e2",
                    })}
                  >
                    <ScheduleRoundedIcon
                      sx={(theme) => ({
                        fontSize: 17,
                        color: theme.palette.warning.main,
                      })}
                    />
                  </Box>

                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(18, settings?.textSize),
                      fontWeight: 800,
                      color: theme.palette.text.primary,
                      letterSpacing: "-0.3px",
                    })}
                  >
                    {t("appointment:upcoming")}
                  </Typography>

                  <Box
                    sx={(theme) => ({
                      px: 1.25,
                      py: 0.2,
                      borderRadius: 999,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.warning.main, 0.16)
                          : "#f8ecd8",
                      color: theme.palette.warning.main,
                      fontSize: scaleFont(12, settings?.textSize),
                      fontWeight: 700,
                    })}
                  >
                    {upcomingItems.length}
                  </Box>
                </Stack>

                <Grid container spacing={2.5}>
                  {upcomingItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <AppointmentCard
                        item={item}
                        onEdit={() =>
                          navigate("/appointments/book", {
                            state: {
                              mode: "edit",
                              appointmentId: item.id,
                              appointment: item,
                            },
                          })
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {completedItems.length > 0 && (
              <Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                  sx={{ mb: 2.5 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={(theme) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.success.main, 0.14)
                            : "#dff4f1",
                      })}
                    >
                      <CheckCircleOutlineRoundedIcon
                        sx={(theme) => ({
                          fontSize: 17,
                          color: theme.palette.success.main,
                        })}
                      />
                    </Box>

                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(18, settings?.textSize),
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        letterSpacing: "-0.3px",
                      })}
                    >
                      {t("appointment:completed")}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.success.main, 0.14)
                            : "#dff4f1",
                        border: (theme) =>
                          `1.5px solid ${alpha(
                            theme.palette.success.main,
                            0.28
                          )}`,
                        color: "success.main",
                        fontSize: scaleFont(12, settings?.textSize),
                        fontWeight: 700,
                      }}
                    >
                      <CheckIcon
                        sx={{ fontSize: scaleFont(13, settings?.textSize) }}
                      />
                      {filteredCompletedItems.length}
                    </Box>
                  </Stack>

                  <CompletedPeriodFilter
                    value={completedFilterMonths}
                    onChange={setCompletedFilterMonths}
                    namespace="appointment"
                  />
                </Stack>

                <Grid container spacing={2.5}>
                  {filteredCompletedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <AppointmentCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {items.length === 0 && (
              <Box
                sx={(theme) => ({
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 4,
                  border: `1px dashed ${theme.palette.divider}`,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.02)
                      : alpha("#000000", 0.01),
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.14)
                        : alpha(theme.palette.primary.main, 0.07),
                  })}
                >
                  <EventAvailableOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 28,
                      color: theme.palette.primary.main,
                      opacity: 0.6,
                    })}
                  />
                </Box>

                <Typography
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    fontSize: scaleFont(14, settings?.textSize),
                    fontWeight: 500,
                  })}
                >
                  {t("appointment:empty")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};