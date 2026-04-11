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
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVetAvailability } from "../../hooks/useVetAvailability";
import type { VetCabinetDto } from "./types/appointment";

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
};

type VetAvailabilitySlotDto = {
  id?: number;
  vetCabinetId?: number;
  startTimeUtc: string;
  endTimeUtc: string;
  capacity?: number;
  bookedCount?: number;
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
            new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime()
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

    const date = new Date(selectedDateKey);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [selectedDateKey]);

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
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            {t("noCabinetSelected")}
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
            fontSize: { xs: 34, md: 44 },
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
              fontSize: 18,
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
              backgroundColor: "#f7ae1a",
              color: "#111827",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              fontSize: 18,
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
              backgroundColor: "#f8f8f8",
              color: "#5f7087",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #ebe7e1",
              fontSize: 18,
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
                fontSize: { xs: 28, md: 34 },
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {t("availabilityTitle")} — {selectedCabinet.name}
            </Typography>

            <Typography sx={{ color: "#5f7087", fontSize: 16 }}>
              {t("service")}: {getServiceLabel(serviceType, t)}
            </Typography>

            {isLoading ? (
              <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Typography color="error">
                {t("availabilityLoadError")}
              </Typography>
            ) : (
              <>
                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  spacing={5}
                  alignItems="flex-start"
                >
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
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
                        sx={{
                          minWidth: 42,
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          color: "#111827",
                          backgroundColor: "#f3eee7",
                        }}
                      >
                        <ChevronLeftRoundedIcon />
                      </Button>

                      <Typography
                        sx={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: "#111827",
                          textTransform: "capitalize",
                        }}
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
                        sx={{
                          minWidth: 42,
                          width: 42,
                          height: 42,
                          borderRadius: 2.5,
                          color: "#111827",
                          backgroundColor: "#f3eee7",
                        }}
                      >
                        <ChevronRightRoundedIcon />
                      </Button>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      {weekDays.map((day) => (
                        <Box
                          key={day}
                          sx={{
                            py: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#5f7087",
                            }}
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
                        gap: 1.5,
                      }}
                    >
                      {calendarDays.map((date, index) => {
                        if (!date) {
                          return <Box key={`empty-${index}`} sx={{ height: 78 }} />;
                        }

                        const key = formatDateKey(date);
                        const variant = getDayVariant(date);
                        const daySlots = slotsByDay.get(key) ?? [];
                        const availableCount = daySlots.filter(isSlotAvailable).length;
                        const isSelected = selectedDateKey === key;

                        let backgroundColor = "#ffffff";
                        let border = "1px solid #e7e1d8";
                        let textColor = "#111827";
                        let subTextColor = "#6b7280";
                        let cursor = "pointer";

                        if (variant === "available") {
                          backgroundColor = isSelected ? "#f7ae1a" : "#56c7c1";
                          border = isSelected
                            ? "2px solid #f5a623"
                            : "1px solid transparent";
                          textColor = "#111827";
                          subTextColor = "#274b4a";
                        }

                        if (variant === "full") {
                          backgroundColor = isSelected ? "#f7ae1a" : "#ffd37a";
                          border = isSelected
                            ? "2px solid #f5a623"
                            : "1px solid transparent";
                          textColor = "#111827";
                          subTextColor = "#8a5d00";
                        }

                        if (variant === "unavailable") {
                          backgroundColor = "#efefef";
                          border = "1px solid #dddddd";
                          textColor = "#b2b2b2";
                          subTextColor = "#b8b8b8";
                          cursor = "default";
                        }

                        return (
                          <Box
                            key={key}
                            onClick={() => {
                              if (variant === "unavailable") return;
                              setSelectedDateKey(key);
                            }}
                            sx={{
                              minHeight: 78,
                              borderRadius: 3,
                              px: 1.2,
                              py: 1.1,
                              backgroundColor,
                              border,
                              cursor,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              transition: "all 0.2s ease",
                              opacity: variant === "unavailable" ? 0.9 : 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: textColor,
                                textAlign: "center",
                              }}
                            >
                              {date.getDate()}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: subTextColor,
                                textAlign: "center",
                              }}
                            >
                              {variant === "unavailable"
                                ? t("calendarNoSlots")
                                : t("calendarSlots", { count: availableCount })}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ mt: 4, flexWrap: "wrap" }}>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 1,
                            backgroundColor: "#56c7c1",
                          }}
                        />
                        <Typography sx={{ color: "#5f7087", fontSize: 15 }}>
                          {t("calendarAvailable")}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 1,
                            backgroundColor: "#ffd37a",
                          }}
                        />
                        <Typography sx={{ color: "#5f7087", fontSize: 15 }}>
                          {t("calendarLimited")}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 1,
                            backgroundColor: "#efefef",
                            border: "1px solid #dddddd",
                          }}
                        />
                        <Typography sx={{ color: "#5f7087", fontSize: 15 }}>
                          {t("calendarUnavailable")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: "#111827",
                        mb: 2,
                      }}
                    >
                      {t("availableHours")}
                    </Typography>

                    {selectedDateKey ? (
                      <>
                        <Typography
                          sx={{
                            mb: 3,
                            fontSize: 16,
                            color: "#5f7087",
                          }}
                        >
                          {t("availableHoursFor", { date: selectedDateLabel })}
                        </Typography>

                        {selectedDaySlots.length > 0 ? (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "repeat(2, minmax(0, 1fr))",
                                md: "repeat(3, minmax(0, 1fr))",
                              },
                              gap: 2,
                            }}
                          >
                            {selectedDaySlots.map((slot, index) => {
                              const isSelectedSlot =
                                selectedSlot?.startTimeUtc === slot.startTimeUtc;

                              return (
                                <Button
                                  key={`${slot.startTimeUtc}-${index}`}
                                  onClick={() => setSelectedSlot(slot)}
                                  sx={{
                                    py: 2.1,
                                    borderRadius: 2.5,
                                    textTransform: "none",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    border: isSelectedSlot
                                      ? "2px solid #f5a623"
                                      : "1px solid #e4ddd4",
                                    backgroundColor: isSelectedSlot
                                      ? "#f7ae1a"
                                      : "#fff",
                                    color: "#111827",
                                    "&:hover": {
                                      backgroundColor: isSelectedSlot
                                        ? "#f3a400"
                                        : "#faf6ef",
                                    },
                                  }}
                                >
                                  {formatTime(slot.startTimeUtc)}
                                </Button>
                              );
                            })}
                          </Box>
                        ) : (
                          <Typography sx={{ color: "#8b8b8b", fontSize: 16 }}>
                            {t("noHoursOnDay")}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography sx={{ color: "#8b8b8b", fontSize: 16 }}>
                        {t("selectDayPrompt")}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ pt: 4 }}
                >
                  <Button
                    onClick={handleBack}
                    startIcon={<ChevronLeftRoundedIcon />}
                    sx={{
                      minWidth: 160,
                      px: 3.5,
                      py: 1.55,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontSize: 18,
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
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    endIcon={<ChevronRightRoundedIcon />}
                    sx={{
                      minWidth: 160,
                      px: 3.5,
                      py: 1.55,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontSize: 18,
                      fontWeight: 700,
                      backgroundColor: selectedSlot ? "#f7ae1a" : "#f4d28a",
                      color: selectedSlot ? "#111827" : "#8c7a4e",
                      "&:hover": {
                        backgroundColor: selectedSlot ? "#f3a400" : "#f4d28a",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#f4d28a",
                        color: "#8c7a4e",
                      },
                    }}
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