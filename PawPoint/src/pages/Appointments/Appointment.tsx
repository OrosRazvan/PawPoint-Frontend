import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppointments } from "../../hooks/useAppointments";
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

  const { data = [], isLoading, isError } = useAppointments();

  const items = useMemo(() => mapAppointments(data), [data]);

  const completedItems = items.filter((item) => item.status === "completed");
  const upcomingItems = items.filter((item) => item.status === "upcoming");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f4ef",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
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
              sx={{
                fontSize: { xs: 34, md: 42 },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0b1f44",
              }}
            >
              {t("appointment:title")}
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: 18,
                color: "#5f7087",
              }}
            >
              {t("appointment:subtitle")}
            </Typography>
          </Box>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => navigate("/appointments/book")}
            sx={{
              px: 2.5,
              py: 1.2,
              borderRadius: 2.5,
              color: "#fff",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.1px",
              background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
              boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
              },
            }}
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
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#071c42",
                    mb: 3,
                  }}
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
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#071c42",
                    mb: 3,
                  }}
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
              <Typography sx={{ color: "#667085" }}>
                {t("appointment:empty")}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};