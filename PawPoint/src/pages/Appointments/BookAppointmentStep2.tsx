import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVetAvailability } from "../../hooks/useVetAvailability";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import type { VetCabinetDto } from "./types/appointment";

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
};

type VetAvailabilitySlotDto = {
  id?: number;
  vetCabinetId?: number;
  startTimeUtc: string;
  endTimeUtc: string;
  capacity?: number;
  bookedCount?: number;
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

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatTime = (value: string) => {
  const date = new Date(value);

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    from: formatDateKey(start),
    to: formatDateKey(end),
  };
};

const getCalendarDays = (currentMonth: Date) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startWeekDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days: Array<Date | null> = [];

  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

const isSlotAvailable = (slot: VetAvailabilitySlotDto) => {
  const capacity = slot.capacity ?? 1;
  const bookedCount = slot.bookedCount ?? 0;

  return bookedCount < capacity;
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

export const BookAppointmentStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("appointment");
  const { data: settings } = useSettings();

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  const weekDays = [
    t("weekSun"),
    t("weekMon"),
    t("weekTue"),
    t("weekWed"),
    t("weekThu"),
    t("weekFri"),
    t("weekSat"),
  ];

  const monthKeys = [
    "monthJanuary",
    "monthFebruary",
    "monthMarch",
    "monthApril",
    "monthMay",
    "monthJune",
    "monthJuly",
    "monthAugust",
    "monthSeptember",
    "monthOctober",
    "monthNovember",
    "monthDecember",
  ];

  const state = (location.state ?? null) as LocationState | null;

  const mode = state?.mode ?? "create";
  const appointmentId = state?.appointmentId ?? null;
  const editingAppointment = state?.appointment ?? null;

  const selectedCabinet = state?.selectedCabinet ?? null;
  const serviceType = state?.serviceType ?? "Consult";

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<VetAvailabilitySlotDto | null>(
    null
  );

  const { from, to } = useMemo(() => getMonthRange(currentMonth), [currentMonth]);

  const {
    data: availability = [],
    isLoading,
    isError,
  } = useVetAvailability({
    vetCabinetId: selectedCabinet?.id,
    from,
    to,
    enabled: !!selectedCabinet?.id,
  });

  useEffect(() => {
    setSelectedDateKey(null);
    setSelectedSlot(null);
  }, [currentMonth, selectedCabinet?.id]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, VetAvailabilitySlotDto[]>();

    (availability as VetAvailabilitySlotDto[]).forEach((slot) => {
      const slotDate = new Date(slot.startTimeUtc);
      const key = formatDateKey(slotDate);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(slot);
    });

    map.forEach((slots, key) => {
      map.set(
        key,
        [...slots].sort(
          (a, b) =>
            new Date(a.startTimeUtc).getTime() -
            new Date(b.startTimeUtc).getTime()
        )
      );
    });

    return map;
  }, [availability]);

  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  const selectedDaySlots = useMemo(() => {
    if (!selectedDateKey) return [];

    const slots = slotsByDay.get(selectedDateKey) ?? [];
    return slots.filter(isSlotAvailable);
  }, [selectedDateKey, slotsByDay]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateKey) return "";
    return formatDateBySettings(selectedDateKey, dateFormat);
  }, [selectedDateKey, dateFormat]);

  useEffect(() => {
    if (!selectedDateKey) {
      const firstAvailableDay = Array.from(slotsByDay.entries()).find(([, slots]) =>
        slots.some(isSlotAvailable)
      );

      if (firstAvailableDay) {
        setSelectedDateKey(firstAvailableDay[0]);
      }
    }
  }, [slotsByDay, selectedDateKey]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDateKey]);

  useEffect(() => {
    if (
      mode !== "edit" ||
      !editingAppointment?.slotStartTimeUtc ||
      selectedSlot
    ) {
      return;
    }

    const oldSlotDate = new Date(editingAppointment.slotStartTimeUtc);
    if (Number.isNaN(oldSlotDate.getTime())) return;

    const oldDateKey = formatDateKey(oldSlotDate);
    const daySlots = slotsByDay.get(oldDateKey) ?? [];

    const matchedSlot =
      daySlots.find(
        (slot) => slot.startTimeUtc === editingAppointment.slotStartTimeUtc
      ) ?? null;

    if (matchedSlot) {
      setSelectedDateKey(oldDateKey);
      setSelectedSlot(matchedSlot);
    }
  }, [mode, editingAppointment, slotsByDay, selectedSlot]);

  if (!selectedCabinet) {
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
            {t("noCabinetSelected")}
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

  const handleBack = () => {
    navigate("/appointments/book", {
      state: {
        mode,
        appointmentId,
        appointment: editingAppointment,
        selectedCabinet,
        serviceType,
      },
    });
  };

  const handleNext = () => {
    if (!selectedSlot || !selectedDateKey) return;

    navigate("/appointments/book/confirmation", {
      state: {
        mode,
        appointmentId,
        appointment: editingAppointment,
        selectedCabinet,
        serviceType,
        selectedDate: selectedDateKey,
        selectedSlot,
      },
    });
  };

  const getDayVariant = (date: Date) => {
    const key = formatDateKey(date);
    const daySlots = slotsByDay.get(key) ?? [];

    if (daySlots.length === 0) {
      return "unavailable";
    }

    const availableSlots = daySlots.filter(isSlotAvailable);

    if (availableSlots.length > 0) {
      return "available";
    }

    return "full";
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
    fontSize: {
      xs: scaleFont(15, settings?.textSize),
      sm: scaleFont(16, settings?.textSize),
      md: scaleFont(18, settings?.textSize),
    },
    lineHeight: 1.2,
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
          <Box sx={stepSx(true)}>{`2. ${t("step2")}`}</Box>
          <Box sx={stepSx(false)}>{`3. ${t("step3")}`}</Box>
        </Stack>

        <Box
          sx={(theme) => ({
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 24px rgba(0,0,0,0.28)"
                : "0 10px 24px rgba(0,0,0,0.05)",
          })}
        >
          <Stack spacing={{ xs: 3, md: 4 }}>
            <Typography
              sx={(theme) => ({
                fontSize: {
                  xs: scaleFont(24, settings?.textSize),
                  sm: scaleFont(28, settings?.textSize),
                  md: scaleFont(34, settings?.textSize),
                },
                fontWeight: 800,
                color: theme.palette.text.primary,
                wordBreak: "break-word",
              })}
            >
              {t("availabilityTitle")} — {selectedCabinet.name}
            </Typography>

            <Typography
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                fontSize: scaleFont(16, settings?.textSize),
                wordBreak: "break-word",
              })}
            >
              {t("service")}: {getServiceLabel(serviceType, t)}
            </Typography>

            {isLoading ? (
              <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Typography color="error">{t("availabilityLoadError")}</Typography>
            ) : (
              <>
                <Stack
                  direction={{ xs: "column", xl: "row" }}
                  spacing={{ xs: 3, md: 4, xl: 5 }}
                  alignItems="flex-start"
                >
                  <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 3 }}
                    >
                      <Button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        sx={(theme) => ({
                          minWidth: 42,
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          color: theme.palette.text.primary,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha("#ffffff", 0.05)
                              : "#f3eee7",
                          flexShrink: 0,
                        })}
                      >
                        <ChevronLeftRoundedIcon />
                      </Button>

                      <Typography
                        sx={(theme) => ({
                          fontSize: {
                            xs: scaleFont(18, settings?.textSize),
                            sm: scaleFont(22, settings?.textSize),
                            md: scaleFont(24, settings?.textSize),
                          },
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          textTransform: "capitalize",
                          textAlign: "center",
                          px: 1,
                          lineHeight: 1.2,
                        })}
                      >
                        {t(monthKeys[currentMonth.getMonth()])}{" "}
                        {currentMonth.getFullYear()}
                      </Typography>

                      <Button
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        sx={(theme) => ({
                          minWidth: 42,
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          color: theme.palette.text.primary,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha("#ffffff", 0.05)
                              : "#f3eee7",
                          flexShrink: 0,
                        })}
                      >
                        <ChevronRightRoundedIcon />
                      </Button>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                        gap: { xs: 0.75, sm: 1, md: 1.5 },
                        mb: 2,
                      }}
                    >
                      {weekDays.map((day) => (
                        <Box
                          key={day}
                          sx={{
                            py: { xs: 0.5, sm: 0.75, md: 1 },
                            textAlign: "center",
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={(theme) => ({
                              fontSize: {
                                xs: scaleFont(11, settings?.textSize),
                                sm: scaleFont(13, settings?.textSize),
                                md: scaleFont(16, settings?.textSize),
                              },
                              fontWeight: 600,
                              color: theme.palette.text.secondary,
                              lineHeight: 1.2,
                            })}
                          >
                            {day}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                        gap: { xs: 0.75, sm: 1, md: 1.5 },
                      }}
                    >
                      {calendarDays.map((date, index) => {
                        if (!date) {
                          return (
                            <Box
                              key={`empty-${index}`}
                              sx={{
                                height: { xs: 58, sm: 66, md: 78 },
                              }}
                            />
                          );
                        }

                        const key = formatDateKey(date);
                        const variant = getDayVariant(date);
                        const daySlots = slotsByDay.get(key) ?? [];
                        const availableCount = daySlots.filter(isSlotAvailable).length;
                        const isSelected = selectedDateKey === key;

                        return (
                          <Box
                            key={key}
                            onClick={() =>
                              variant !== "unavailable" && setSelectedDateKey(key)
                            }
                            sx={(theme) => {
                              let backgroundColor = theme.palette.background.paper;
                              let border = `1px solid ${theme.palette.divider}`;
                              let cursor = "pointer";

                              if (variant === "available") {
                                backgroundColor = isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === "dark"
                                  ? alpha(theme.palette.success.main, 0.22)
                                  : "#56c7c1";
                                border = isSelected
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "1px solid transparent";
                              }

                              if (variant === "full") {
                                backgroundColor = isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === "dark"
                                  ? alpha(theme.palette.warning.main, 0.22)
                                  : "#ffd37a";
                                border = isSelected
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "1px solid transparent";
                              }

                              if (variant === "unavailable") {
                                backgroundColor =
                                  theme.palette.mode === "dark"
                                    ? alpha("#ffffff", 0.04)
                                    : "#efefef";
                                border = `1px solid ${theme.palette.divider}`;
                                cursor = "default";
                              }

                              return {
                                minHeight: { xs: 58, sm: 66, md: 78 },
                                p: { xs: 0.7, sm: 1, md: 1.4 },
                                borderRadius: 2.5,
                                backgroundColor,
                                border,
                                cursor,
                                transition: "all 0.2s ease",
                                minWidth: 0,
                                overflow: "hidden",
                              };
                            }}
                          >
                            <Typography
                              sx={(theme) => ({
                                fontSize: {
                                  xs: scaleFont(12, settings?.textSize),
                                  sm: scaleFont(14, settings?.textSize),
                                  md: scaleFont(16, settings?.textSize),
                                },
                                fontWeight: 800,
                                color:
                                  variant === "unavailable"
                                    ? theme.palette.text.secondary
                                    : selectedDateKey === key
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.primary,
                                lineHeight: 1.1,
                              })}
                            >
                              {date.getDate()}
                            </Typography>

                            <Typography
                              sx={(theme) => ({
                                mt: { xs: 0.3, sm: 0.45, md: 0.6 },
                                fontSize: {
                                  xs: scaleFont(8.5, settings?.textSize),
                                  sm: scaleFont(10, settings?.textSize),
                                  md: scaleFont(12, settings?.textSize),
                                },
                                color:
                                  variant === "unavailable"
                                    ? theme.palette.text.secondary
                                    : selectedDateKey === key
                                    ? alpha(theme.palette.primary.contrastText, 0.82)
                                    : variant === "available"
                                    ? theme.palette.mode === "dark"
                                      ? "#b6f3e8"
                                      : "#274b4a"
                                    : theme.palette.mode === "dark"
                                    ? "#ffd98f"
                                    : "#8a5d00",
                                lineHeight: 1.15,
                                wordBreak: "break-word",
                              })}
                            >
                              {variant === "unavailable"
                                ? t("noSlots")
                                : variant === "full"
                                ? t("full")
                                : `${availableCount} ${t("availableSlots")}`}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box
                    sx={(theme) => ({
                      width: "100%",
                      maxWidth: { xl: 360 },
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha("#ffffff", 0.03)
                          : "#faf8f5",
                      p: { xs: 2, sm: 2.5, md: 3 },
                    })}
                  >
                    <Typography
                      sx={(theme) => ({
                        fontSize: {
                          xs: scaleFont(19, settings?.textSize),
                          sm: scaleFont(20, settings?.textSize),
                          md: scaleFont(22, settings?.textSize),
                        },
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        wordBreak: "break-word",
                      })}
                    >
                      {selectedDateLabel || t("selectDate")}
                    </Typography>

                    <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                      {selectedDaySlots.length === 0 ? (
                        <Typography
                          sx={(theme) => ({
                            fontSize: scaleFont(15, settings?.textSize),
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {t("noSlotsAvailable")}
                        </Typography>
                      ) : (
                        selectedDaySlots.map((slot) => {
                          const isSelected =
                            selectedSlot?.startTimeUtc === slot.startTimeUtc;

                          return (
                            <Button
                              key={`${slot.startTimeUtc}-${slot.endTimeUtc}`}
                              onClick={() => setSelectedSlot(slot)}
                              sx={(theme) => ({
                                justifyContent: "space-between",
                                px: { xs: 1.6, sm: 2 },
                                py: 1.35,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontSize: scaleFont(16, settings?.textSize),
                                fontWeight: 700,
                                backgroundColor: isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === "dark"
                                  ? alpha("#ffffff", 0.04)
                                  : theme.palette.background.paper,
                                color: isSelected
                                  ? theme.palette.primary.contrastText
                                  : theme.palette.text.primary,
                                border: isSelected
                                  ? `1px solid ${theme.palette.primary.main}`
                                  : `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: isSelected
                                    ? theme.palette.primary.dark
                                    : theme.palette.mode === "dark"
                                    ? alpha("#ffffff", 0.07)
                                    : "#f3eee7",
                                },
                              })}
                            >
                              <span>{formatTime(slot.startTimeUtc)}</span>
                              <span>{formatTime(slot.endTimeUtc)}</span>
                            </Button>
                          );
                        })
                      )}
                    </Stack>
                  </Box>
                </Stack>

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ pt: 2 }}
                >
                  <Button
                    onClick={handleBack}
                    startIcon={<ChevronLeftRoundedIcon />}
                    sx={(theme) => ({
                      width: { xs: "100%", sm: "auto" },
                      minWidth: { xs: "100%", sm: 140 },
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
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    endIcon={<ChevronRightRoundedIcon />}
                    sx={(theme) => ({
                      width: { xs: "100%", sm: "auto" },
                      minWidth: { xs: "100%", sm: 180 },
                      px: 3.5,
                      py: 1.55,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontSize: scaleFont(18, settings?.textSize),
                      fontWeight: 700,
                      backgroundColor: selectedSlot
                        ? theme.palette.primary.main
                        : theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.25)
                        : "#f4d28a",
                      color: selectedSlot
                        ? theme.palette.primary.contrastText
                        : theme.palette.mode === "dark"
                        ? alpha("#ffffff", 0.45)
                        : "#8c7a4e",
                      "&:hover": {
                        backgroundColor: selectedSlot
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
                    {t("next")}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};