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
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { alpha } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppointmentVetCabinets } from "../../hooks/useAppointmentVetCabinets";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";

const sortOptions = [
  { value: "priceAsc", labelKey: "sortPriceAsc" },
  { value: "priceDesc", labelKey: "sortPriceDesc" },
  { value: "ratingAsc", labelKey: "sortRatingAsc" },
  { value: "ratingDesc", labelKey: "sortRatingDesc" },
];

type Step1LocationState = {
  mode?: "create" | "edit";
  appointmentId?: number;
  appointment?: {
    id: number;
    serviceType?: string;
    vetCabinetId?: number;
    animalId?: number;
    slotStartTimeUtc?: string;
  } | null;
};

export const BookAppointmentStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("appointment");
  const { data: settings } = useSettings();

  const fieldSx = (theme: any) => ({
    minWidth: { xs: "100%", sm: 200, md: 220 },
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
  });

  const cardSx = (selected: boolean) => (theme: any) => ({
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    justifyContent: "space-between",
    gap: { xs: 2.25, sm: 2.5, md: 3 },
    px: { xs: 2, sm: 2.5, md: 4 },
    py: { xs: 2, sm: 2.5, md: 4 },
    borderRadius: 3,
    border: selected
      ? `2px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
    backgroundColor: selected
      ? theme.palette.mode === "dark"
        ? alpha(theme.palette.primary.main, 0.18)
        : alpha(theme.palette.primary.main, 0.18)
      : theme.palette.mode === "dark"
      ? alpha("#ffffff", 0.03)
      : "#faf8f5",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.primary.main, 0.12)
          : alpha(theme.palette.primary.main, 0.1),
    },
  });

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

  const formatPrice = (value?: number) => {
    if (value == null) return "—";
    return `${value} RON`;
  };

  const navState = (location.state ?? null) as Step1LocationState | null;

  const [serviceType] = useState(
    navState?.appointment?.serviceType ?? "Consult"
  );
  const [sortBy, setSortBy] = useState("priceAsc");
  const [selectedCabinetId, setSelectedCabinetId] = useState<number | null>(
    navState?.appointment?.vetCabinetId ?? null
  );

  const {
    data: cabinets = [],
    isLoading,
    isError,
  } = useAppointmentVetCabinets({
    serviceType,
    enabled: true,
  });

  const sortedCabinets = useMemo(() => {
    const result = [...cabinets];

    result.sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return (
            (a.basePriceRon ?? Number.MAX_SAFE_INTEGER) -
            (b.basePriceRon ?? Number.MAX_SAFE_INTEGER)
          );

        case "priceDesc":
          return (b.basePriceRon ?? -1) - (a.basePriceRon ?? -1);

        case "ratingAsc":
          return (
            (a.rating ?? Number.MAX_SAFE_INTEGER) -
            (b.rating ?? Number.MAX_SAFE_INTEGER)
          );

        case "ratingDesc":
          return (b.rating ?? -1) - (a.rating ?? -1);

        default:
          return 0;
      }
    });

    return result;
  }, [cabinets, sortBy]);

  const selectedCabinet = useMemo(
    () =>
      sortedCabinets.find((cabinet) => cabinet.id === selectedCabinetId) ?? null,
    [sortedCabinets, selectedCabinetId]
  );

  const handleNext = () => {
    if (!selectedCabinet) return;

    navigate("/appointments/book/date-time", {
      state: {
        mode: navState?.mode ?? "create",
        appointmentId: navState?.appointmentId ?? null,
        appointment: navState?.appointment ?? null,
        selectedCabinet,
        serviceType,
      },
    });
  };

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
          <Box sx={stepSx(true)}>{`1. ${t("step1")}`}</Box>
          <Box sx={stepSx(false)}>{`2. ${t("step2")}`}</Box>
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
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", lg: "center" }}
              spacing={2}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.75, sm: 1.5 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    minWidth: 56,
                  })}
                >
                  {t("service")}:
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    minWidth: 56,
                    wordBreak: "break-word",
                  })}
                >
                  {t("consult")}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2 }}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    minWidth: 36,
                  })}
                >
                  {t("sort")}
                </Typography>

                <TextField
                  select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setSelectedCabinetId(null);
                  }}
                  sx={fieldSx}
                >
                  {sortOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontSize: scaleFont(14, settings?.textSize) }}
                    >
                      {t(option.labelKey)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            {isLoading ? (
              <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Typography color="error">{t("loadCabinetsError")}</Typography>
            ) : (
              <Stack spacing={3}>
                {sortedCabinets.map((cabinet) => {
                  const isSelected = selectedCabinetId === cabinet.id;

                  return (
                    <Box
                      key={cabinet.id}
                      sx={cardSx(isSelected)}
                      onClick={() => setSelectedCabinetId(cabinet.id)}
                    >
                      <Stack
                        direction="row"
                        spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                        alignItems="center"
                        sx={{ minWidth: 0, flex: 1 }}
                      >
                        <Box
                          sx={(theme) => ({
                            width: { xs: 60, sm: 70, md: 82 },
                            height: { xs: 60, sm: 70, md: 82 },
                            borderRadius: 3,
                            backgroundColor: theme.palette.primary.main,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: theme.palette.primary.contrastText,
                            flexShrink: 0,
                          })}
                        >
                          <PetsRoundedIcon
                            sx={{ fontSize: { xs: 28, sm: 32, md: 38 } }}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={(theme) => ({
                              fontSize: {
                                xs: scaleFont(18, settings?.textSize),
                                sm: scaleFont(20, settings?.textSize),
                                md: scaleFont(22, settings?.textSize),
                              },
                              fontWeight: 800,
                              color: theme.palette.text.primary,
                              lineHeight: 1.2,
                              wordBreak: "break-word",
                            })}
                          >
                            {cabinet.name}
                          </Typography>

                          <Typography
                            sx={(theme) => ({
                              mt: 0.8,
                              fontSize: scaleFont(14, settings?.textSize),
                              color: theme.palette.text.secondary,
                              wordBreak: "break-word",
                            })}
                          >
                            {cabinet.address || "—"}
                          </Typography>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 0.5, sm: 1 }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            sx={{ mt: 1.4 }}
                          >
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
                              <StarRoundedIcon
                                sx={(theme) => ({
                                  fontSize: 18,
                                  color: theme.palette.warning.main,
                                })}
                              />
                              <Typography
                                sx={(theme) => ({
                                  fontSize: scaleFont(15, settings?.textSize),
                                  fontWeight: 700,
                                  color: theme.palette.text.primary,
                                })}
                              >
                                {cabinet.rating != null
                                  ? cabinet.rating.toFixed(1)
                                  : "—"}
                              </Typography>
                            </Stack>

                            <Typography
                              sx={(theme) => ({
                                fontSize: scaleFont(14, settings?.textSize),
                                color: theme.palette.text.secondary,
                              })}
                            >
                              • {formatPrice(cabinet.basePriceRon)}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      <Button
                        endIcon={<ChevronRightRoundedIcon />}
                        sx={(theme) => ({
                          alignSelf: { xs: "stretch", sm: "center" },
                          width: { xs: "100%", sm: "auto" },
                          px: 2.4,
                          py: 1.1,
                          borderRadius: 2.5,
                          minWidth: { xs: "100%", sm: 130 },
                          textTransform: "none",
                          fontSize: scaleFont(15, settings?.textSize),
                          fontWeight: 700,
                          backgroundColor: isSelected
                            ? theme.palette.primary.main
                            : theme.palette.mode === "dark"
                            ? alpha("#ffffff", 0.05)
                            : "#f3eee7",
                          color: isSelected
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.primary,
                          "&:hover": {
                            backgroundColor: isSelected
                              ? theme.palette.primary.dark
                              : theme.palette.mode === "dark"
                              ? alpha("#ffffff", 0.08)
                              : "#ece4d8",
                          },
                        })}
                      >
                        {isSelected ? t("selected") : t("select")}
                      </Button>
                    </Box>
                  );
                })}
              </Stack>
            )}

            <Stack
              direction="row"
              justifyContent={{ xs: "stretch", sm: "flex-end" }}
              sx={{ pt: 1 }}
            >
              <Button
                onClick={handleNext}
                disabled={!selectedCabinet}
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
                  backgroundColor: selectedCabinet
                    ? theme.palette.primary.main
                    : theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.25)
                    : "#f4d28a",
                  color: selectedCabinet
                    ? theme.palette.primary.contrastText
                    : theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.45)
                    : "#8c7a4e",
                  "&:hover": {
                    backgroundColor: selectedCabinet
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
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};