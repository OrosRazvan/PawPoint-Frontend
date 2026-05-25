import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckIcon from "@mui/icons-material/Check";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useVaccinations } from "../../hooks/useVaccinations";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import "../../utils/pdfFont";
import logo from "../../assets/logo.jpg";

import { VaccinationCard } from "./components/VaccinationCard";
import { AddVaccinationDialog } from "./components/AddVaccinationDialog";
import { EditVaccinationDialog } from "./components/EditVaccinationDialog";
import { DeleteVaccinationDialog } from "./components/DeleteVaccinationDialog";
import {
  CompletedPeriodFilter,
  type CompletedFilterMonths,
} from "../../components/CompletedPeriodFilter";
import { filterCompletedByPeriod } from "../../utils/completedPeriodFilter";
import {
  Currency,
  VaccineTypeLabels,
  type VaccinationCardItem,
  type VaccinationDto,
} from "./types/vaccination";

const pickFirst = <T,>(...values: T[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const resolveStatus = (item: VaccinationDto): "completed" | "upcoming" => {
  const raw = item as Record<string, unknown>;

  const slotValue = pickFirst(
    item.slotStartTimeUtc,
    item.startTimeUtc,
    raw.SlotStartTimeUtc as string | undefined,
    raw.StartTimeUtc as string | undefined,
    item.nextDate,
    raw.NextDate as string | undefined,
    item.lastDate,
    raw.LastDate as string | undefined
  );

  const slotDate = new Date(String(slotValue ?? "")).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapVaccinations = (
  items: VaccinationDto[],
  t: (key: string) => string
) => {
  return items.map((item) => {
    const raw = item as Record<string, unknown>;

    const animalName =
      pickFirst(
        item.animalName,
        raw.AnimalName as string | undefined,
        raw.petName as string | undefined,
        raw.PetName as string | undefined
      ) ?? t("vaccination:petFallback");

    const vaccineType =
      Number(
        pickFirst(
          item.vaccineType,
          raw.VaccineType as number | undefined,
          raw.vaccineType as number | undefined
        )
      ) || 1;

    const lastDate =
      pickFirst(
        item.lastDate,
        item.lastDateUtc,
        raw.LastDate as string | undefined,
        raw.LastDateUtc as string | undefined,
        raw.date as string | undefined,
        raw.Date as string | undefined
      ) ?? null;

    const nextDate =
      pickFirst(
        item.nextDate,
        item.nextDateUtc,
        raw.NextDate as string | undefined,
        raw.NextDateUtc as string | undefined,
        item.slotStartTimeUtc,
        item.slotStartUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined
      ) ?? null;

    const slotStartTimeUtc =
      pickFirst(
        item.slotStartTimeUtc,
        item.slotStartUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined,
        item.nextDate,
        raw.NextDate as string | undefined,
        item.lastDate,
        raw.LastDate as string | undefined
      ) ?? "";

    const slotEndTimeUtc =
      pickFirst(
        item.slotEndTimeUtc,
        item.slotEndUtc,
        raw.SlotEndTimeUtc as string | undefined,
        raw.SlotEndUtc as string | undefined,
        item.endTimeUtc,
        raw.EndTimeUtc as string | undefined
      ) ?? "";

    const vetCabinetName =
      pickFirst(
        item.vetCabinetName,
        raw.VetCabinetName as string | undefined,
        raw.veterinarianName as string | undefined,
        raw.VeterinarianName as string | undefined,
        raw.clinicName as string | undefined,
        raw.ClinicName as string | undefined
      ) ?? "";

    const notes = pickFirst(item.notes, raw.Notes as string | undefined) ?? null;

    return {
      id: item.id,
      animalId: item.animalId,
      animalName,
      vaccineType,
      lastDate,
      nextDate,
      vetCabinetId: item.vetCabinetId,
      vetCabinetName,
      vetTimeSlotId: item.vetTimeSlotId,
      slotStartTimeUtc,
      slotEndTimeUtc,
      price: item.price ?? (raw.Price as number | undefined) ?? null,
      currency: item.currency ?? (raw.Currency as number | undefined),
      notes,
      status: resolveStatus({
        ...item,
        slotStartTimeUtc,
      } as VaccinationDto),
    };
  });
};

export const Vaccinations = () => {
  const { t } = useTranslation(["vaccination"]);
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useVaccinations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<VaccinationCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<VaccinationCardItem | null>(
    null
  );

  const [completedFilterMonths, setCompletedFilterMonths] =
    useState<CompletedFilterMonths>(3);

  const [pdfLanguage, setPdfLanguage] = useState<"ro" | "en">("ro");

  const items: VaccinationCardItem[] = useMemo(
    () => mapVaccinations(data, t) as VaccinationCardItem[],
    [data, t]
  );

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

  const pdfText = {
    ro: {
      generated: "Raport generat automat",
      title: "Raport vaccinări finalizate",
      period: "Perioadă",
      lastMonths: "ultimele",
      months: "luni",
      generatedAt: "Generat la",
      totalVaccinations: "Total vaccinări",
      animal: "Animal",
      vaccine: "Vaccin",
      date: "Data",
      vet: "Veterinar",
      interval: "Interval",
      price: "Preț",
      totalCost: "Cost total",
      footer: "Raport generat automat de PawPoint.",
      fileName: "vaccinari",
    },
    en: {
      generated: "Automatically generated report",
      title: "Completed vaccinations report",
      period: "Period",
      lastMonths: "last",
      months: "months",
      generatedAt: "Generated on",
      totalVaccinations: "Total vaccinations",
      animal: "Pet",
      vaccine: "Vaccine",
      date: "Date",
      vet: "Veterinarian",
      interval: "Time slot",
      price: "Price",
      totalCost: "Total cost",
      footer: "Report automatically generated by PawPoint.",
      fileName: "vaccinations",
    },
  };

  const downloadVaccinationReport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const labels = pdfText[pdfLanguage];
    const pdfLocale = pdfLanguage === "ro" ? "ro-RO" : "en-GB";
    const normalizeCurrency = (currency: unknown): number => {
      if (currency === Currency.Ron || currency === "RON" || currency === "Ron" || currency === "ron") {
        return Currency.Ron;
      }

      return Currency.Eur;
    };

    const selectedCurrency = normalizeCurrency(settings?.currency);
    const currencyLabel = selectedCurrency === Currency.Ron ? "RON" : "EUR";

    const convertPrice = (price: number, currency?: unknown) => {
      const itemCurrency = normalizeCurrency(currency);

      if (itemCurrency === selectedCurrency) {
        return price;
      }

      if (itemCurrency === Currency.Eur && selectedCurrency === Currency.Ron) {
        return price * 4.95;
      }

      if (itemCurrency === Currency.Ron && selectedCurrency === Currency.Eur) {
        return price / 4.95;
      }

      return price;
    };

    const total = filteredCompletedItems.reduce((sum, item) => {
      if (item.price == null) {
        return sum;
      }

      return sum + convertPrice(item.price, item.currency);
    }, 0);

    const reportDate = new Date().toLocaleDateString(pdfLocale);
    const font = "Roboto-Regular";

    doc.setFont(font, "normal");

    doc.setFillColor(255, 248, 238);
    doc.rect(0, 0, pageWidth, 42, "F");

    doc.addImage(logo, "JPEG", 14, 10, 18, 18);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(22);
    doc.text("PawPoint", 38, 19);

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(10);
    doc.text(labels.generated, 38, 26);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(18);
    doc.text(labels.title, 14, 56);

    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `${labels.period}: ${labels.lastMonths} ${completedFilterMonths} ${labels.months}`,
      14,
      65
    );
    doc.text(`${labels.generatedAt}: ${reportDate}`, 14, 71);
    doc.text(`${labels.totalVaccinations}: ${filteredCompletedItems.length}`, 14, 77);

    autoTable(doc, {
      startY: 88,
      theme: "plain",
      head: [
        [
          labels.animal,
          labels.vaccine,
          labels.date,
          labels.vet,
          labels.interval,
          labels.price,
        ],
      ],
      body: filteredCompletedItems.map((item) => {
        const dateSource = item.lastDate || item.slotStartTimeUtc;

        const date = dateSource
          ? new Date(dateSource).toLocaleDateString(pdfLocale)
          : "—";

        const start = item.slotStartTimeUtc
          ? new Date(item.slotStartTimeUtc).toLocaleTimeString(pdfLocale, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";

        const end = item.slotEndTimeUtc
          ? new Date(item.slotEndTimeUtc).toLocaleTimeString(pdfLocale, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";

        return [
          item.animalName || "—",
          typeof item.vaccineType === "number"
            ? VaccineTypeLabels[item.vaccineType]
            : item.vaccineType || "—",
          date,
          item.vetCabinetName || "—",
          `${start} - ${end}`,
          item.price != null
            ? `${convertPrice(item.price, item.currency).toFixed(2)} ${currencyLabel}`
            : "—",
        ];
      }),
      styles: {
        font,
        fontSize: 9,
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
        textColor: [45, 45, 45],
        overflow: "linebreak",
        valign: "middle",
        lineColor: [235, 235, 235],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [245, 166, 35],
        textColor: [255, 255, 255],
        fontStyle: "normal",
        fontSize: 9.5,
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252],
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 34 },
        2: { cellWidth: 24 },
        3: { cellWidth: 42 },
        4: { cellWidth: 28 },
        5: { cellWidth: 30, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 120;

    doc.setFillColor(7, 28, 66);
    doc.roundedRect(14, finalY + 12, pageWidth - 28, 18, 4, 4, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont(font, "normal");
    doc.setFontSize(12);
    doc.text(
      `${labels.totalCost}: ${total.toFixed(2)} ${currencyLabel}`,
      20,
      finalY + 24
    );

    doc.setTextColor(130, 130, 130);
    doc.setFontSize(8.5);
    doc.text(labels.footer, 14, 286);

    doc.save(
      `pawpoint-${labels.fileName}-${completedFilterMonths}-months-${pdfLanguage}.pdf`
    );
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
              <VaccinesOutlinedIcon sx={{ fontSize: 26 }} />
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
                {t("vaccination:title")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {t("vaccination:subtitle")}
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsAddOpen(true)}
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
            {t("vaccination:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("vaccination:loadError")}</Typography>
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
                    {t("vaccination:upcoming")}
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
                      <VaccinationCard
                        item={item}
                        onEdit={() => setEditItem(item)}
                        onDelete={() => setDeleteItem(item)}
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
                      {t("vaccination:completed")}
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

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <TextField
                      select
                      size="small"
                      value={pdfLanguage}
                      onChange={(event) => setPdfLanguage(event.target.value as "ro" | "en")}
                      sx={{
                        minWidth: 150,

                        "& .MuiOutlinedInput-root": {
                          borderRadius: "999px",
                          backgroundColor: "background.paper",
                          paddingRight: 1,

                          "& fieldset": {
                            borderColor: "divider",
                          },

                          "&:hover fieldset": {
                            borderColor: "divider",
                          },

                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                            borderWidth: "1px",
                          },
                        },

                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          paddingY: "10px",
                          paddingLeft: "18px",
                          paddingRight: "36px !important",
                          fontWeight: 600,
                        },
                      }}
                    >
                      <MenuItem value="ro">{t("vaccination:language.ro")}</MenuItem>
                      <MenuItem value="en">{t("vaccination:language.en")}</MenuItem>
                    </TextField>

                    <Button
                      startIcon={<DownloadRoundedIcon />}
                      disabled={filteredCompletedItems.length === 0}
                      onClick={downloadVaccinationReport}
                      sx={(theme) => ({
                        px: 2,
                        py: 0.9,
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: scaleFont(13, settings?.textSize),
                        color: theme.palette.success.main,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.success.main, 0.14)
                            : "#dff4f1",
                        border: `1px solid ${alpha(
                          theme.palette.success.main,
                          0.18
                        )}`,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.success.main, 0.22)
                              : "#d2efeb",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.55,
                        },
                      })}
                    >
                      {t("vaccination:raport")}
                    </Button>

                    <CompletedPeriodFilter
                      value={completedFilterMonths}
                      onChange={setCompletedFilterMonths}
                      namespace="vaccination"
                    />
                  </Stack>
                </Stack>

                <Grid container spacing={2.5}>
                  {filteredCompletedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <VaccinationCard item={item} />
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
                  <VaccinesOutlinedIcon
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
                  {t("vaccination:empty")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

      <AddVaccinationDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <EditVaccinationDialog
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
      />

      <DeleteVaccinationDialog
        open={!!deleteItem}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
      />
    </Box>
  );
};