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

const pageBg = "#f8f4ef";

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

const rowSx = {
  py: 3.2,
  borderBottom: "1px solid #ebe3da",
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
        sx={{
          minHeight: "100vh",
          backgroundColor: pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontSize: scaleFont(24, settings?.textSize), fontWeight: 700 }}>
            {t("missingAppointmentData")}
          </Typography>

          <Button
            onClick={() => navigate("/appointments/book")}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 2.5,
              textTransform: "none",
              backgroundColor: "#f7ae1a",
              color: "#111827",
              fontWeight: 700,
              fontSize: scaleFont(14, settings?.textSize),
              "&:hover": {
                backgroundColor: "#f3a400",
              },
            }}
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBg,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={4}>
        <Typography
          sx={{
            fontSize: {
              xs: scaleFont(34, settings?.textSize),
              md: scaleFont(44, settings?.textSize),
            },
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.05,
          }}
        >
          {t("bookPageTitle")}
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
          <Box
            sx={{
              flex: 1,
              py: 2.6,
              px: 3,
              borderRadius: 3,
              backgroundColor: "#f8f8f8",
              color: "#5f7087",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #ebe7e1",
              fontSize: scaleFont(18, settings?.textSize),
            }}
          >
            {`1. ${t("step1")}`}
          </Box>

          <Box
            sx={{
              flex: 1,
              py: 2.6,
              px: 3,
              borderRadius: 3,
              backgroundColor: "#f8f8f8",
              color: "#5f7087",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #ebe7e1",
              fontSize: scaleFont(18, settings?.textSize),
            }}
          >
            {`2. ${t("step2")}`}
          </Box>

          <Box
            sx={{
              flex: 1,
              py: 2.6,
              px: 3,
              borderRadius: 3,
              backgroundColor: "#f7ae1a",
              color: "#111827",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              fontSize: scaleFont(18, settings?.textSize),
            }}
          >
            {`3. ${t("step3")}`}
          </Box>
        </Stack>

        <Box
          sx={{
            borderRadius: 4,
            backgroundColor: "#fffdfb",
            border: "1px solid #ebe3da",
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
            boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Stack spacing={4}>
            <Typography
              sx={{
                fontSize: {
                  xs: scaleFont(28, settings?.textSize),
                  md: scaleFont(34, settings?.textSize),
                },
                fontWeight: 800,
                color: "#111827",
              }}
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("veterinarian")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("service")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("animal")}
                </Typography>

                {isAnimalsLoading ? (
                  <CircularProgress size={24} />
                ) : isAnimalsError ? (
                  <Typography color="error">
                    {t("loadAnimalsError")}
                  </Typography>
                ) : (
                  <TextField
                    select
                    value={selectedAnimalId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedAnimalId(value === "" ? "" : Number(value));
                    }}
                    sx={{
                      minWidth: 180,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        backgroundColor: "#fff",
                        fontSize: scaleFont(14, settings?.textSize),
                        "& fieldset": {
                          borderColor: "#ded8cf",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#f5a623",
                          borderWidth: 1.5,
                        },
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: scaleFont(14, settings?.textSize) }}>
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("date")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("time")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
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
                <Typography sx={{ fontSize: scaleFont(18, settings?.textSize), color: "#5f7087" }}>
                  {t("estimatedPrice")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {formatPrice(estimatedPrice)}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                borderRadius: 3,
                backgroundColor: "#d9f1ee",
                px: 2.4,
                py: 2.4,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: scaleFont(16, settings?.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {t("notification24h")}
                </Typography>

                <Box
                  sx={{
                    px: 2.2,
                    py: 0.8,
                    borderRadius: 999,
                    backgroundColor: "#4cc9c0",
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: scaleFont(14, settings?.textSize),
                  }}
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
                sx={{
                  minWidth: 140,
                  px: 3.5,
                  py: 1.55,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  backgroundColor: "#e8e2d9",
                  color: "#111827",
                  "&:hover": {
                    backgroundColor: "#ddd5ca",
                  },
                }}
              >
                {t("back")}
              </Button>

              <Button
                onClick={handleConfirm}
                disabled={!selectedAnimal || isCreating || isUpdating}
                sx={{
                  minWidth: 280,
                  px: 3.5,
                  py: 1.55,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  backgroundColor:
                    selectedAnimal && !isCreating && !isUpdating
                      ? "#f7ae1a"
                      : "#f4d28a",
                  color:
                    selectedAnimal && !isCreating && !isUpdating
                      ? "#111827"
                      : "#8c7a4e",
                  "&:hover": {
                    backgroundColor:
                      selectedAnimal && !isCreating && !isUpdating
                        ? "#f3a400"
                        : "#f4d28a",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f4d28a",
                    color: "#8c7a4e",
                  },
                }}
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