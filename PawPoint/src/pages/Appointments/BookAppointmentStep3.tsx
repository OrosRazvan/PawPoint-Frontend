import { useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAnimals } from "../../hooks/useAnimals";
import { useCreateAppointment } from "../../hooks/useCreateAppointment";
import { useUpdateAppointment } from "../../hooks/useUpdateAppointment";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import type {
  AnimalDto,
  VetCabinetDto,
  VetAvailabilitySlotDto,
} from "./types/appointment";

type EditingAppointment = {
  id: number;
  animalId?: number;
  serviceType?: string;
  vetCabinetId?: number;
  slotStartTimeUtc?: string;
};

type LocationState = {
  mode?: "create" | "edit";
  appointmentId?: number;
  appointment?: EditingAppointment | null;
  selectedCabinet: VetCabinetDto;
  serviceType: string;
  selectedDate: string;
  selectedSlot: VetAvailabilitySlotDto;
};

type AppDateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

const formatDateBySettings = (
  value?: string | Date | null,
  format: AppDateFormat = "DD/MM/YYYY"
) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

const formatTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatPrice = (value?: number | null) => {
  if (value == null) return "—";
  return `${value} RON`;
};

const getServiceLabel = (serviceType: string, t: (key: string) => string) => {
  switch (serviceType) {
    case "Consult":
      return t("consult");
    case "Grooming":
      return t("grooming");
    case "Checkup":
      return t("checkup");
    default:
      return serviceType || t("serviceFallback");
  }
};

export const BookAppointmentStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("appointment");
  const { data: settings } = useSettings();

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  const state = (location.state ?? null) as LocationState | null;

  const mode = state?.mode ?? "create";
  const appointmentId = state?.appointmentId ?? null;
  const editingAppointment = state?.appointment ?? null;

  const selectedCabinet = state?.selectedCabinet ?? null;
  const serviceType = state?.serviceType ?? "Consult";
  const selectedSlot = state?.selectedSlot ?? null;

  const [selectedAnimalId, setSelectedAnimalId] = useState<number | "">(
    state?.appointment?.animalId ?? ""
  );
  const [notify24hInAdvance] = useState(true);

  const {
    data: animals = [],
    isLoading: isAnimalsLoading,
    isError: isAnimalsError,
  } = useAnimals(true);

  const {
    mutate: createAppointmentMutate,
    isPending: isCreating,
  } = useCreateAppointment();

  const {
    mutate: updateAppointmentMutate,
    isPending: isUpdating,
  } = useUpdateAppointment();

  const selectedAnimal = useMemo(
    () =>
      animals.find((animal: AnimalDto) => animal.id === Number(selectedAnimalId)) ??
      null,
    [animals, selectedAnimalId]
  );

  if (!selectedCabinet || !selectedSlot) {
    return (
      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        })}
      >
        <Stack spacing={2} alignItems="center">
          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(24, settings?.textSize),
              fontWeight: 700,
              color: theme.palette.text.primary,
            })}
          >
            {t("missingAppointmentData")}
          </Typography>

          <Button
            onClick={() => navigate("/appointments/book")}
            sx={(theme) => ({
              px: 3,
              py: 1.2,
              borderRadius: 2.5,
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 700,
              fontSize: scaleFont(14, settings?.textSize),
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            })}
          >
            {t("backToStep1")}
          </Button>
        </Stack>
      </Box>
    );
  }

  const estimatedPrice = selectedCabinet.basePriceRon ?? null;

  const handleBack = () => {
    navigate("/appointments/book/date-time", {
      state: {
        mode,
        appointmentId,
        appointment: editingAppointment,
        selectedCabinet,
        serviceType,
      },
    });
  };

  const handleConfirm = () => {
    if (!selectedAnimal || !selectedSlot?.id) return;

    if (mode === "edit" && appointmentId) {
      updateAppointmentMutate(
        {
          appointmentId,
          vetTimeSlotId: selectedSlot.id,
          estimatedPriceRon: estimatedPrice,
          notes: null,
          status: "Confirmed",
          notify24hInAdvance,
        },
        {
          onSuccess: () => {
            navigate("/appointments");
          },
        }
      );

      return;
    }

    createAppointmentMutate(
      {
        animalId: selectedAnimal.id,
        vetCabinetId: selectedCabinet.id,
        vetTimeSlotId: selectedSlot.id,
        serviceType,
        estimatedPriceRon: estimatedPrice,
        notes: null,
        notify24hInAdvance,
      },
      {
        onSuccess: () => {
          navigate("/appointments");
        },
      }
    );
  };

  const rowSx = (theme: any) => ({
    py: 3.2,
    borderBottom: `1px solid ${theme.palette.divider}`,
  });

  const stepSx = (active: boolean) => (theme: any) => ({
    flex: 1,
    py: 2.6,
    px: 3,
    borderRadius: 3,
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.mode === "dark"
      ? alpha("#ffffff", 0.04)
      : "#f8f8f8",
    color: active
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    fontWeight: active ? 700 : 600,
    textAlign: "center",
    border: active ? "none" : `1px solid ${theme.palette.divider}`,
    boxShadow: active
      ? theme.palette.mode === "dark"
        ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`
        : "0 8px 20px rgba(0,0,0,0.06)"
      : "none",
    fontSize: scaleFont(18, settings?.textSize),
  });

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      })}
    >
      <Stack spacing={4}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: scaleFont(34, settings?.textSize),
              md: scaleFont(44, settings?.textSize),
            },
            fontWeight: 800,
            color: theme.palette.text.primary,
            lineHeight: 1.05,
          })}
        >
          {t("bookPageTitle")}
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
          <Box sx={stepSx(false)}>{`1. ${t("step1")}`}</Box>
          <Box sx={stepSx(false)}>{`2. ${t("step2")}`}</Box>
          <Box sx={stepSx(true)}>{`3. ${t("step3")}`}</Box>
        </Stack>

        <Box
          sx={(theme) => ({
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,0.28)"
                : "0 10px 24px rgba(0,0,0,0.05)",
          })}
        >
          <Stack spacing={4}>
            <Typography
              sx={(theme) => ({
                fontSize: {
                  xs: scaleFont(28, settings?.textSize),
                  md: scaleFont(34, settings?.textSize),
                },
                fontWeight: 800,
                color: theme.palette.text.primary,
              })}
            >
              {t("summary")}
            </Typography>

            <Box sx={rowSx}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("veterinarian")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {selectedCabinet.name}
                </Typography>
              </Stack>
            </Box>

            <Box sx={rowSx}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("service")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {getServiceLabel(serviceType, t)}
                </Typography>
              </Stack>
            </Box>

            <Box sx={rowSx}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("animal")}
                </Typography>

                {isAnimalsLoading ? (
                  <CircularProgress size={24} />
                ) : isAnimalsError ? (
                  <Typography color="error">{t("loadAnimalsError")}</Typography>
                ) : (
                  <TextField
                    select
                    value={selectedAnimalId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedAnimalId(value === "" ? "" : Number(value));
                    }}
                    sx={(theme) => ({
                      minWidth: 180,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha("#ffffff", 0.03)
                            : theme.palette.background.paper,
                        fontSize: scaleFont(14, settings?.textSize),
                        color: theme.palette.text.primary,
                        "& fieldset": {
                          borderColor: theme.palette.divider,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1.5,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.text.secondary,
                        },
                      },
                    })}
                  >
                    <MenuItem
                      value=""
                      sx={{ fontSize: scaleFont(14, settings?.textSize) }}
                    >
                      {t("selectPet")}
                    </MenuItem>

                    {animals.map((animal: AnimalDto) => (
                      <MenuItem
                        key={animal.id}
                        value={animal.id}
                        sx={{ fontSize: scaleFont(14, settings?.textSize) }}
                      >
                        {animal.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>
            </Box>

            <Box sx={rowSx}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("date")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {formatDateBySettings(selectedSlot.startTimeUtc, dateFormat)}
                </Typography>
              </Stack>
            </Box>

            <Box sx={rowSx}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("time")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {formatTime(selectedSlot.startTimeUtc)}
                </Typography>
              </Stack>
            </Box>

            <Box sx={rowSx}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    color: theme.palette.text.secondary,
                  })}
                >
                  {t("estimatedPrice")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {formatPrice(estimatedPrice)}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={(theme) => ({
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.18)
                    : "#d9f1ee",
                px: 2.4,
                py: 2.4,
              })}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(16, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {t("notification24h")}
                </Typography>

                <Box
                  sx={(theme) => ({
                    px: 2.2,
                    py: 0.8,
                    borderRadius: 999,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.success.main, 0.28)
                        : "#4cc9c0",
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.success.main
                        : "#111827",
                    fontWeight: 700,
                    fontSize: scaleFont(14, settings?.textSize),
                  })}
                >
                  {t("active")}
                </Box>
              </Stack>
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ pt: 2 }}
            >
              <Button
                onClick={handleBack}
                startIcon={<ChevronLeftRoundedIcon />}
                sx={(theme) => ({
                  minWidth: 140,
                  px: 3.5,
                  py: 1.55,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.06)
                      : "#e8e2d9",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.1)
                        : "#ddd5ca",
                  },
                })}
              >
                {t("back")}
              </Button>

              <Button
                onClick={handleConfirm}
                disabled={!selectedAnimal || isCreating || isUpdating}
                sx={(theme) => ({
                  minWidth: 280,
                  px: 3.5,
                  py: 1.55,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  backgroundColor:
                    selectedAnimal && !isCreating && !isUpdating
                      ? theme.palette.primary.main
                      : theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.25)
                      : "#f4d28a",
                  color:
                    selectedAnimal && !isCreating && !isUpdating
                      ? theme.palette.primary.contrastText
                      : theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.45)
                      : "#8c7a4e",
                  "&:hover": {
                    backgroundColor:
                      selectedAnimal && !isCreating && !isUpdating
                        ? theme.palette.primary.dark
                        : theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.25)
                        : "#f4d28a",
                  },
                  "&.Mui-disabled": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.25)
                        : "#f4d28a",
                    color:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.45)
                        : "#8c7a4e",
                  },
                })}
              >
                {isCreating || isUpdating
                  ? t("confirming")
                  : t("confirmAppointment")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};