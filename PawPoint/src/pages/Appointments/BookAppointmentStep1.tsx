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
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppointmentVetCabinets } from "../../hooks/useAppointmentVetCabinets";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";

const pageBg = "#f8f4ef";

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

  const fieldSx = {
    minWidth: 170,
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
  };

  const cardSx = (selected: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
    px: 4,
    py: 4,
    borderRadius: 3,
    border: selected ? "2px solid #f5a623" : "1px solid #e4ddd4",
    backgroundColor: selected ? "#f6dfab" : "#faf8f5",
    transition: "all 0.2s ease",
    cursor: "pointer",
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
              backgroundColor: "#f7ae1a",
              color: "#111827",
              fontWeight: 700,
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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
              backgroundColor: "#f8f8f8",
              color: "#5f7087",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #ebe7e1",
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
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: "#111827",
                    minWidth: 56,
                  }}
                >
                  {t("service")}:
                </Typography>

                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: "#111827",
                    minWidth: 56,
                  }}
                >
                  {t("consult")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  sx={{
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 600,
                    color: "#111827",
                    minWidth: 36,
                  }}
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
              <Typography color="error">
                {t("loadCabinetsError")}
              </Typography>
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
                        spacing={2.5}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                      >
                        <Box
                          sx={{
                            width: 82,
                            height: 82,
                            borderRadius: 3,
                            backgroundColor: "#f7ae1a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0b1f44",
                            flexShrink: 0,
                          }}
                        >
                          <PetsRoundedIcon sx={{ fontSize: 38 }} />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: scaleFont(22, settings?.textSize),
                              fontWeight: 800,
                              color: "#111827",
                              lineHeight: 1.2,
                            }}
                          >
                            {cabinet.name}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="center"
                            sx={{ mt: 1 }}
                          >
                            <Typography
                              sx={{
                                fontSize: scaleFont(16, settings?.textSize),
                                color: "#5f7087",
                              }}
                            >
                              {t("rating")}: {cabinet.rating ?? "—"}
                            </Typography>

                            <StarRoundedIcon
                              sx={{ fontSize: 19, color: "#f7ae1a" }}
                            />
                          </Stack>

                          <Typography
                            sx={{
                              mt: 0.8,
                              fontSize: scaleFont(16, settings?.textSize),
                              color: "#5f7087",
                            }}
                          >
                            {t("workingHours")}: {t("workingHoursValue")}
                          </Typography>

                          {cabinet.basePriceRon != null && (
                            <Typography
                              sx={{
                                mt: 0.8,
                                fontSize: scaleFont(15, settings?.textSize),
                                color: "#6b7280",
                              }}
                            >
                              {t("price")}: {formatPrice(cabinet.basePriceRon)}
                            </Typography>
                          )}
                        </Box>
                      </Stack>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCabinetId(cabinet.id);
                        }}
                        sx={{
                          minWidth: 116,
                          px: 3,
                          py: 1.3,
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontSize: scaleFont(18, settings?.textSize),
                          fontWeight: 700,
                          color: "#111827",
                          backgroundColor: "#f7ae1a",
                          "&:hover": {
                            backgroundColor: "#f3a400",
                          },
                        }}
                      >
                        {t("select")}
                      </Button>
                    </Box>
                  );
                })}

                <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedCabinet}
                    endIcon={<ChevronRightRoundedIcon />}
                    sx={{
                      minWidth: 160,
                      px: 3.5,
                      py: 1.55,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontSize: scaleFont(18, settings?.textSize),
                      fontWeight: 700,
                      backgroundColor: selectedCabinet ? "#f7ae1a" : "#f4d28a",
                      color: selectedCabinet ? "#111827" : "#8c7a4e",
                      "&:hover": {
                        backgroundColor: selectedCabinet ? "#f3a400" : "#f4d28a",
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
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};