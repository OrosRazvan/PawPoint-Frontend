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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
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

  const { mutate: createAppointmentMutate, isPending: isCreating } =
    useCreateAppointment();

  const { mutate: updateAppointmentMutate, isPending: isUpdating } =
    useUpdateAppointment();

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
              textAlign: "center",
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

  const stepSx = (active: boolean) => (theme: any) => ({
    flex: 1,
    py: { xs: 1.8, sm: 2.2, md: 2.6 },
    px: { xs: 2, sm: 2.5, md: 3 },
    borderRadius: 3,
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.mode === "dark"
      ? alpha("#ffffff", 0.04)
      : "#f8f8f8",
    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    fontWeight: active ? 700 : 600,
    textAlign: "center",
    border: active ? "none" : `1px solid ${theme.palette.divider}`,
    boxShadow: active
      ? theme.palette.mode === "dark"
        ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.18)}`
        : "0 8px 20px rgba(0,0,0,0.06)"
      : "none",
    fontSize: {
      xs: scaleFont(15, settings?.textSize),
      sm: scaleFont(16, settings?.textSize),
      md: scaleFont(18, settings?.textSize),
    },
    lineHeight: 1.2,
  });

  const selectFieldSx = (theme: any) => ({
    width: "100%",
    "& .MuiOutlinedInput-root": {
      height: 48,
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.04)
          : theme.palette.background.paper,
      fontSize: scaleFont(14, settings?.textSize),
      color: theme.palette.text.primary,
      "& .MuiSelect-select": {
        py: 1,
      },
      "& fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.18),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.45),
      },
      "&.Mui-focused": {
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
      },
    },
  });

  const infoCardSx = (theme: any) => ({
    p: { xs: 2, sm: 2.25 },
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === "dark" ? alpha("#ffffff", 0.03) : "#ffffff",
  });

  const SummaryRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={(theme) => ({
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        "&:last-of-type": {
          borderBottom: "none",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          width: 38,
          height: 38,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.main, 0.14)
              : alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          flexShrink: 0,
        })}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={(theme) => ({
            fontSize: scaleFont(12.5, settings?.textSize),
            color: theme.palette.text.secondary,
            fontWeight: 600,
            mb: 0.25,
          })}
        >
          {label}
        </Typography>

        <Typography
          sx={(theme) => ({
            fontSize: scaleFont(15.5, settings?.textSize),
            color: theme.palette.text.primary,
            fontWeight: 800,
            wordBreak: "break-word",
          })}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
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
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: scaleFont(30, settings?.textSize),
              sm: scaleFont(36, settings?.textSize),
              md: scaleFont(44, settings?.textSize),
            },
            fontWeight: 800,
            color: theme.palette.text.primary,
            lineHeight: 1.05,
            wordBreak: "break-word",
          })}
        >
          {t("bookPageTitle")}
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={stepSx(false)}>{`1. ${t("step1")}`}</Box>
          <Box sx={stepSx(false)}>{`2. ${t("step2")}`}</Box>
          <Box sx={stepSx(true)}>{`3. ${t("step3")}`}</Box>
        </Stack>

        <Box
          sx={(theme) => ({
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )} 0%, ${theme.palette.background.paper} 42%)`
                : "linear-gradient(135deg, #fff9ef 0%, #ffffff 42%)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 18px 48px rgba(0,0,0,0.32)"
                : "0 18px 48px rgba(7,28,66,0.08)",
          })}
        >
          <Box
            sx={(theme) => ({
              px: { xs: 2.5, sm: 3.5, md: 4 },
              py: { xs: 3, md: 3.5 },
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: theme.palette.primary.contrastText,
                    boxShadow: `0 10px 22px ${alpha(
                      theme.palette.primary.main,
                      0.28
                    )}`,
                    flexShrink: 0,
                  })}
                >
                  <EventAvailableRoundedIcon sx={{ fontSize: 27 }} />
                </Box>

                <Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: {
                        xs: scaleFont(24, settings?.textSize),
                        md: scaleFont(32, settings?.textSize),
                      },
                      fontWeight: 900,
                      color: theme.palette.text.primary,
                      letterSpacing: "-0.5px",
                      lineHeight: 1.1,
                    })}
                  >
                    {t("summary")}
                  </Typography>

                  <Typography
                    sx={(theme) => ({
                      mt: 0.6,
                      fontSize: scaleFont(14, settings?.textSize),
                      color: theme.palette.text.secondary,
                    })}
                  >
                    {mode === "edit"
                      ? t("editDialogSubtitle") || t("summary")
                      : t("confirmAppointment")}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={(theme) => ({
                  px: 2,
                  py: 0.9,
                  borderRadius: 999,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.success.main, 0.16)
                      : "#dff4f1",
                  color: theme.palette.success.main,
                  fontSize: scaleFont(13, settings?.textSize),
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                })}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 17 }} />
                {t("active")}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={{ xs: 3, lg: 4 }}
              alignItems="stretch"
            >
              <Box sx={{ flex: 1.05, minWidth: 0 }}>
                <Stack spacing={2.5}>
                  <Box sx={infoCardSx}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Box
                        sx={(theme) => ({
                          width: 42,
                          height: 42,
                          borderRadius: 2.25,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.14)
                              : alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                        })}
                      >
                        <PetsRoundedIcon sx={{ fontSize: 22 }} />
                      </Box>

                      <Box>
                        <Typography
                          sx={(theme) => ({
                            fontSize: scaleFont(18, settings?.textSize),
                            fontWeight: 850,
                            color: theme.palette.text.primary,
                          })}
                        >
                          {t("animal")}
                        </Typography>

                        <Typography
                          sx={(theme) => ({
                            fontSize: scaleFont(13, settings?.textSize),
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {t("selectPet")}
                        </Typography>
                      </Box>
                    </Stack>

                    {isAnimalsLoading ? (
                      <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
                        <CircularProgress size={26} />
                      </Box>
                    ) : isAnimalsError ? (
                      <Typography color="error">{t("loadAnimalsError")}</Typography>
                    ) : (
                      <TextField
                        select
                        fullWidth
                        value={selectedAnimalId}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedAnimalId(value === "" ? "" : Number(value));
                        }}
                        sx={selectFieldSx}
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
                  </Box>

                  <Box
                    sx={(theme) => ({
                      p: { xs: 2, sm: 2.25 },
                      borderRadius: 3,
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.success.main, 0.24)
                          : alpha(theme.palette.success.main, 0.18)
                      }`,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.success.main, 0.1)
                          : "#edfaf8",
                    })}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={(theme) => ({
                          width: 42,
                          height: 42,
                          borderRadius: 2.25,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.success.main, 0.18)
                              : "#dff4f1",
                          color: theme.palette.success.main,
                          flexShrink: 0,
                        })}
                      >
                        <NotificationsActiveRoundedIcon sx={{ fontSize: 22 }} />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={(theme) => ({
                            fontSize: scaleFont(15.5, settings?.textSize),
                            fontWeight: 800,
                            color: theme.palette.text.primary,
                            wordBreak: "break-word",
                          })}
                        >
                          {t("notification24h")}
                        </Typography>

                        <Typography
                          sx={(theme) => ({
                            mt: 0.25,
                            fontSize: scaleFont(13, settings?.textSize),
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {t("active")}
                        </Typography>
                      </Box>

                      <CheckCircleRoundedIcon
                        sx={(theme) => ({
                          fontSize: 24,
                          color: theme.palette.success.main,
                          flexShrink: 0,
                        })}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ flex: 1.35, minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 3.5,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.03)
                        : "#fbfaf7",
                    height: "100%",
                  })}
                >
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(19, settings?.textSize),
                      fontWeight: 900,
                      color: theme.palette.text.primary,
                      mb: 1.5,
                    })}
                  >
                    {t("appointmentDetails") || t("summary")}
                  </Typography>

                  <SummaryRow
                    icon={<LocalHospitalRoundedIcon sx={{ fontSize: 20 }} />}
                    label={t("veterinarian")}
                    value={selectedCabinet.name}
                  />

                  <SummaryRow
                    icon={<MedicalServicesRoundedIcon sx={{ fontSize: 20 }} />}
                    label={t("service")}
                    value={getServiceLabel(serviceType, t)}
                  />

                  <SummaryRow
                    icon={<CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />}
                    label={t("date")}
                    value={formatDateBySettings(selectedSlot.startTimeUtc, dateFormat)}
                  />

                  <SummaryRow
                    icon={<AccessTimeRoundedIcon sx={{ fontSize: 20 }} />}
                    label={t("time")}
                    value={formatTime(selectedSlot.startTimeUtc)}
                  />

                  <Box
                    sx={(theme) => ({
                      mt: 2.25,
                      p: 2.25,
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${alpha(
                              theme.palette.primary.main,
                              0.16
                            )}, ${alpha(theme.palette.primary.dark, 0.08)})`
                          : "linear-gradient(135deg, #fff3d8, #fffaf0)",
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                    })}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                          sx={(theme) => ({
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.main, 0.16)
                                : alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                          })}
                        >
                          <PaymentsRoundedIcon sx={{ fontSize: 21 }} />
                        </Box>

                        <Typography
                          sx={(theme) => ({
                            fontSize: scaleFont(15, settings?.textSize),
                            fontWeight: 750,
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {t("estimatedPrice")}
                        </Typography>
                      </Stack>

                      <Typography
                        sx={(theme) => ({
                          fontSize: {
                            xs: scaleFont(20, settings?.textSize),
                            sm: scaleFont(24, settings?.textSize),
                          },
                          fontWeight: 950,
                          color: theme.palette.text.primary,
                          whiteSpace: "nowrap",
                        })}
                      >
                        {formatPrice(estimatedPrice)}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                onClick={handleBack}
                startIcon={<ChevronLeftRoundedIcon />}
                sx={(theme) => ({
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { xs: "100%", sm: 150 },
                  px: 3.5,
                  py: 1.45,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(16, settings?.textSize),
                  fontWeight: 800,
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
                startIcon={<CheckCircleRoundedIcon />}
                sx={(theme) => ({
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { xs: "100%", sm: 280 },
                  px: 3.5,
                  py: 1.45,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontSize: scaleFont(16, settings?.textSize),
                  fontWeight: 900,
                  background:
                    selectedAnimal && !isCreating && !isUpdating
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.25)
                      : "#f4d28a",
                  color:
                    selectedAnimal && !isCreating && !isUpdating
                      ? theme.palette.primary.contrastText
                      : theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.45)
                      : "#8c7a4e",
                  boxShadow:
                    selectedAnimal && !isCreating && !isUpdating
                      ? `0 10px 22px ${alpha(theme.palette.primary.main, 0.28)}`
                      : "none",
                  "&:hover": {
                    background:
                      selectedAnimal && !isCreating && !isUpdating
                        ? `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
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
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};