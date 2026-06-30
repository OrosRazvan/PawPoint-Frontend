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
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckIcon from "@mui/icons-material/Check";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useDewormings } from "../../hooks/useDewormings";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import "../../utils/pdfFont";
import logo from "../../assets/logo.jpg";

import { DewormingCard } from "./components/DewormingCard";
import { AddDewormingDialog } from "./components/AddDewormingDialog";
import { EditDewormingDialog } from "./components/EditDewormingDialog";
import { DeleteDewormingDialog } from "./components/DeleteDewormingDialog";
import {
  CompletedPeriodFilter,
  type CompletedFilterMonths,
} from "../../components/CompletedPeriodFilter";
import { filterCompletedByPeriod } from "../../utils/completedPeriodFilter";
import type { DewormingCardItem, DewormingDto } from "./types/deworming";

const DEWORMING_TYPE_LABELS: Record<number, string> = {
  0: "Necunoscută",
  1: "Internă",
  2: "Externă",
  3: "Combinată",
  4: "Control",
};

const pickFirst = <T,>(
  ...values: Array<T | undefined | null | "">
): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value as T;
    }
  }

  return undefined;
};

const resolveStatus = (item: DewormingDto): "completed" | "upcoming" => {
  const raw = item as Record<string, unknown>;

  const slotValue = pickFirst(
    item.slotStartTimeUtc,
    item.startTimeUtc,
    raw.SlotStartTimeUtc as string | undefined,
    raw.StartTimeUtc as string | undefined,
    item.nextDate,
    raw.NextDate as string | undefined,
    item.date,
    raw.Date as string | undefined
  );

  const slotDate = new Date(String(slotValue ?? "")).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapDewormings = (
  items: DewormingDto[],
  t: (key: string) => string
): DewormingCardItem[] => {
  return items.map((item) => {
    const raw = item as Record<string, unknown>;

    const animalName =
      pickFirst(
        item.animalName,
        raw.animalName as string | undefined,
        raw.AnimalName as string | undefined
      ) ?? t("deworming:petFallback");

    const rawType = pickFirst(
      item.type,
      raw.type as number | string | undefined,
      raw.Type as number | string | undefined
    );

    const normalizedType =
      typeof rawType === "string" ? rawType.toLowerCase() : rawType;

    const type =
      normalizedType === "internal" || normalizedType === 1
        ? 1
        : normalizedType === "external" || normalizedType === 2
        ? 2
        : normalizedType === "combined" || normalizedType === 3
        ? 3
        : normalizedType === "control" || normalizedType === 4
        ? 4
        : 0;

    const date =
      pickFirst(
        item.dateUtc,
        raw.dateUtc as string | undefined,
        raw.DateUtc as string | undefined,
        item.date,
        raw.date as string | undefined,
        raw.Date as string | undefined
      ) ?? null;

    const nextDate =
      pickFirst(
        item.nextDateUtc,
        raw.nextDateUtc as string | undefined,
        raw.NextDateUtc as string | undefined,
        item.nextDate,
        raw.nextDate as string | undefined,
        raw.NextDate as string | undefined
      ) ?? null;

    const slotStartTimeUtc =
      pickFirst(
        item.slotStartUtc,
        raw.slotStartUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.slotStartTimeUtc,
        raw.slotStartTimeUtc as string | undefined,
        raw.SlotStartTimeUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined,
        date ?? undefined
      ) ?? "";

    const slotEndTimeUtc =
      pickFirst(
        item.slotEndUtc,
        raw.slotEndUtc as string | undefined,
        raw.SlotEndUtc as string | undefined,
        item.slotEndTimeUtc,
        raw.slotEndTimeUtc as string | undefined,
        raw.SlotEndTimeUtc as string | undefined,
        item.endTimeUtc,
        raw.EndTimeUtc as string | undefined
      ) ?? "";

    const vetCabinetName =
      pickFirst(
        item.vetCabinetName,
        raw.vetCabinetName as string | undefined,
        raw.VetCabinetName as string | undefined
      ) ?? "";

    const notes = pickFirst(item.notes, raw.Notes as string | undefined) ?? null;

    return {
      id: item.id,
      animalId: item.animalId,
      animalName,
      type,
      date,
      nextDate,
      vetCabinetId: item.vetCabinetId,
      vetCabinetName,
      vetTimeSlotId: item.vetTimeSlotId,
      slotStartTimeUtc,
      slotEndTimeUtc,
      price: item.price ?? null,
      currency: item.currency,
      notes,
      status: resolveStatus({
        ...item,
        slotStartTimeUtc,
        date,
        nextDate,
      } as DewormingDto),
    };
  });
};

export const Deworming = () => {
  const { t } = useTranslation(["deworming"]);
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useDewormings();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<DewormingCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DewormingCardItem | null>(null);

  const [completedFilterMonths, setCompletedFilterMonths] =
    useState<CompletedFilterMonths>(3);

  const [pdfLanguage, setPdfLanguage] = useState<"ro" | "en">("ro");

  const items = useMemo(() => mapDewormings(data, t), [data, t]);

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
      title: "Raport deparazitări finalizate",
      period: "Perioadă",
      lastMonths: "ultimele",
      months: "luni",
      generatedAt: "Generat la",
      total: "Total deparazitări",
      animal: "Animal",
      type: "Tip",
      date: "Data",
      next: "Următoarea",
      vet: "Veterinar",
      interval: "Interval",
      price: "Preț",
      totalCost: "Cost total",
      footer: "Raport generat automat de PawPoint.",
      fileName: "deparazitari",
    },

    en: {
      generated: "Automatically generated report",
      title: "Completed deworming report",
      period: "Period",
      lastMonths: "last",
      months: "months",
      generatedAt: "Generated on",
      total: "Total dewormings",
      animal: "Pet",
      type: "Type",
      date: "Date",
      next: "Next",
      vet: "Veterinarian",
      interval: "Time slot",
      price: "Price",
      totalCost: "Total cost",
      footer: "Report automatically generated by PawPoint.",
      fileName: "dewormings",
    },
  };

  const downloadDewormingReport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const labels = pdfText[pdfLanguage];
    const pdfLocale = pdfLanguage === "ro" ? "ro-RO" : "en-GB";

    const normalizeCurrency = (currency: unknown): number => {
      if (
        currency === 2 ||
        currency === "RON" ||
        currency === "Ron" ||
        currency === "ron"
      ) {
        return 2;
      }

      return 1;
    };

    const selectedCurrency = normalizeCurrency(settings?.currency);
    const currencyLabel = selectedCurrency === 2 ? "RON" : "EUR";

    const convertPrice = (price: number, currency?: unknown) => {
      const itemCurrency = normalizeCurrency(currency);

      if (itemCurrency === selectedCurrency) {
        return price;
      }

      if (itemCurrency === 1 && selectedCurrency === 2) {
        return price * 4.95;
      }

      if (itemCurrency === 2 && selectedCurrency === 1) {
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
    doc.text(`${labels.total}: ${filteredCompletedItems.length}`, 14, 77);

    autoTable(doc, {
      startY: 88,
      theme: "plain",
      head: [
        [
          labels.animal,
          labels.type,
          labels.date,
          labels.next,
          labels.vet,
          labels.interval,
          labels.price,
        ],
      ],
      body: filteredCompletedItems.map((item) => {
        const dateSource = item.date || item.slotStartTimeUtc;

        const date = dateSource
          ? new Date(dateSource).toLocaleDateString(pdfLocale)
          : "—";

        const nextDate = item.nextDate
          ? new Date(item.nextDate).toLocaleDateString(pdfLocale)
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
          DEWORMING_TYPE_LABELS[item.type] ?? "—",
          date,
          nextDate,
          item.vetCabinetName || "—",
          `${start} - ${end}`,
          item.price != null
            ? `${convertPrice(item.price, item.currency).toFixed(2)} ${currencyLabel}`
            : "—",
        ];
      }),
      styles: {
        font,
        fontSize: 8.5,
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
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 23 },
        3: { cellWidth: 25 },
        4: { cellWidth: 37 },
        5: { cellWidth: 27 },
        6: { cellWidth: 26, halign: "right" },
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
              <BugReportOutlinedIcon sx={{ fontSize: 26 }} />
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
                {t("deworming:title")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {t("deworming:subtitle")}
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
            {t("deworming:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("deworming:loadError")}</Typography>
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
                    {t("deworming:upcoming")}
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
                      <DewormingCard
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
                      {t("deworming:completed")}
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
                      onChange={(event) =>
                        setPdfLanguage(event.target.value as "ro" | "en")
                      }
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
                      <MenuItem value="ro">
                        {t("deworming:language.ro")}
                      </MenuItem>

                      <MenuItem value="en">
                        {t("deworming:language.en")}
                      </MenuItem>
                    </TextField>

                    <Button
                      startIcon={<DownloadRoundedIcon />}
                      disabled={filteredCompletedItems.length === 0}
                      onClick={downloadDewormingReport}
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
                      {t("deworming:raport")}
                    </Button>

                    <CompletedPeriodFilter
                      value={completedFilterMonths}
                      onChange={setCompletedFilterMonths}
                      namespace="deworming"
                    />
                  </Stack>
                </Stack>

                <Grid container spacing={2.5}>
                  {filteredCompletedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <DewormingCard item={item} />
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
                  <BugReportOutlinedIcon
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
                  {t("deworming:empty")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

      <AddDewormingDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <EditDewormingDialog
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
      />

      <DeleteDewormingDialog
        open={!!deleteItem}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
      />
    </Box>
  );
};