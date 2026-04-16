import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppointments } from "../../hooks/useAppointments";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { AppointmentCard } from "./components/AppointmentCard";
import type { AppointmentCardItem, AppointmentDto } from "./types/appointment";

const resolveStatus = (item: AppointmentDto): "completed" | "upcoming" => {
  const slotValue = item.slotStartTimeUtc ?? item.startTimeUtc ?? "";
  const slotDate = new Date(slotValue).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapAppointments = (items: AppointmentDto[]): AppointmentCardItem[] => {
  return items.map((item) => ({
    id: item.id,
    animalId: item.animalId,
    animalName: item.animalName ?? "Pet",
    serviceType: item.serviceType ?? "Consult",
    vetCabinetId: item.vetCabinetId,
    vetCabinetName: item.vetCabinetName ?? "Veterinary Clinic",
    vetCabinetAddress: item.vetCabinetAddress ?? null,
    vetTimeSlotId: item.vetTimeSlotId,
    slotStartTimeUtc: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
    slotEndTimeUtc: item.slotEndTimeUtc ?? item.endTimeUtc ?? "",
    vetDoctorName: item.vetDoctorName ?? null,
    priceRon: item.priceRon ?? null,
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

  const items = useMemo(() => mapAppointments(data), [data]);

  const completedItems = items.filter((item) => item.status === "completed");
  const upcomingItems = items.filter((item) => item.status === "upcoming");

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
          <Box>
            <Typography
              sx={(theme) => ({
                fontSize: {
                  xs: scaleFont(34, settings?.textSize),
                  md: scaleFont(42, settings?.textSize),
                },
                fontWeight: 800,
                lineHeight: 1.1,
                color: theme.palette.text.primary,
              })}
            >
              {t("appointment:title")}
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1.5,
                fontSize: scaleFont(18, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {t("appointment:subtitle")}
            </Typography>
          </Box>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => navigate("/appointments/book")}
            sx={(theme) => ({
              px: 2.5,
              py: 1.2,
              borderRadius: 2.5,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              fontSize: scaleFont(14, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.1px",
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
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("appointment:loadError")}</Typography>
        ) : (
          <Stack spacing={5}>
            {upcomingItems.length > 0 && (
              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3,
                  })}
                >
                  {t("appointment:upcoming")}
                </Typography>

                <Grid container spacing={3}>
                  {upcomingItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
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
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3,
                  })}
                >
                  {t("appointment:completed")}
                </Typography>

                <Grid container spacing={3}>
                  {completedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                      <AppointmentCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {completedItems.length === 0 && upcomingItems.length === 0 && (
              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: scaleFont(16, settings?.textSize),
                })}
              >
                {t("appointment:empty")}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};