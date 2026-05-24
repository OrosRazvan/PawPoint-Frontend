import { Paper, Stack, Typography, Box, Chip, Button } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Currency } from "../types/appointment";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { AppointmentCardItem } from "../types/appointment";
import "../../../utils/pdfFont";

type Props = {
  item: AppointmentCardItem;
  onEdit?: () => void;
  onDelete?: () => void;
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

const formatTime = (value?: string | null, locale = "en-GB") => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatCurrency = (
  value?: number | null,
  currency?: Currency
) => {
  if (value == null) return "—";

  return `${value} ${currency === Currency.Ron ? "RON" : "EUR"}`;
};

const formatDateTimeBySettings = (
  value: string | null | undefined,
  format: AppDateFormat,
  t: (key: string, options?: Record<string, unknown>) => string,
  locale: string
) => {
  if (!value) return "—";

  return t("appointment:dateTimeLabel", {
    date: formatDateBySettings(value, format),
    time: formatTime(value, locale),
  });
};

const downloadAppointmentPdf = (
  item: AppointmentCardItem,
  t: (key: string, options?: Record<string, unknown>) => string,
  dateFormat: AppDateFormat,
  locale: string
) => {
  const doc = new jsPDF();

  const appointmentDate = formatDateTimeBySettings(
    item.slotStartTimeUtc,
    dateFormat,
    t,
    locale
  );

  const issuedAt = new Date().toLocaleDateString(locale);

  doc.setFillColor(245, 166, 35);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Roboto-Regular", "normal");
  doc.setFontSize(26);
  doc.text("PawPoint", 14, 20);

  doc.setTextColor(30, 30, 30);

  doc.setFontSize(18);
  doc.text(t("appointment:report.title"), 14, 46);

  doc.setFontSize(11);
  doc.setFont("Roboto-Regular", "normal");

  doc.text(
    `${t("appointment:report.number")}: #APT-${item.id}`,
    14,
    56
  );

  doc.text(
    `${t("appointment:report.issuedAt")}: ${issuedAt}`,
    14,
    63
  );

  autoTable(doc, {
    startY: 74,
    theme: "grid",

    styles: {
      font: "Roboto-Regular",
      fontSize: 11,
      cellPadding: 4,
      textColor: [40, 40, 40],
      lineColor: [230, 230, 230],
      lineWidth: 0.3,
    },

    headStyles: {
      fillColor: [245, 166, 35],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },

    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },

    body: [
      [
        t("appointment:report.pet"),
        item.animalName || "—",
      ],
      [
        t("appointment:report.service"),
        item.serviceType || "—",
      ],
      [
        t("appointment:report.clinic"),
        item.vetCabinetName || "—",
      ],
      [
        t("appointment:report.address"),
        item.vetCabinetAddress || "—",
      ],
      [
        t("appointment:report.doctor"),
        item.vetDoctorName || "—",
      ],
      [
        t("appointment:report.date"),
        appointmentDate,
      ],
      [
        t("appointment:report.status"),
        t(`appointment:status.${item.status}`),
      ],
      [
        t("appointment:report.notes"),
        item.notes || "—",
      ],
    ],
  });

  const finalY =
    (
      doc as jsPDF & {
        lastAutoTable?: { finalY: number };
      }
    ).lastAutoTable?.finalY ?? 120;

  doc.setFillColor(245, 166, 35);
  doc.roundedRect(14, finalY + 12, 70, 16, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Roboto-Regular", "normal");
  doc.setFontSize(13);

  doc.text(
    `${t("appointment:report.total")}: ${
      formatCurrency(item.price, item.currency)
    }`,
    18,
    finalY + 22
  );

  doc.save(`pawpoint-appointment-${item.id}.pdf`);
};

export const AppointmentCard = ({ item, onEdit }: Props) => {
  const { t, i18n } = useTranslation(["appointment"]);
  const { data: settings } = useSettings();

  const isCompleted = item.status === "completed";
  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";
  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        minHeight: 250,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.22)"
            : "0 2px 12px rgba(7,28,66,0.06)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 32px rgba(0,0,0,0.3)"
              : "0 8px 28px rgba(7,28,66,0.11)",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          height: 4,
          background: isCompleted
            ? `linear-gradient(90deg, ${theme.palette.success.main}, ${alpha(
                theme.palette.success.main,
                0.4
              )})`
            : `linear-gradient(90deg, ${theme.palette.warning.main}, ${alpha(
                theme.palette.warning.main,
                0.4
              )})`,
        })}
      />

      <Stack spacing={0} sx={{ p: 2.75 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Stack
            direction="row"
            spacing={1.75}
            alignItems="center"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Box
              sx={(theme) => ({
                width: 44,
                height: 44,
                borderRadius: 2.5,
                flexShrink: 0,
                background: isCompleted
                  ? theme.palette.mode === "dark"
                    ? `linear-gradient(135deg, ${alpha(
                        theme.palette.success.main,
                        0.22
                      )} 0%, ${alpha(theme.palette.success.light, 0.14)} 100%)`
                    : "linear-gradient(135deg, #dff4f1 0%, #c8ede8 100%)"
                  : theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${alpha(
                      theme.palette.warning.main,
                      0.22
                    )} 0%, ${alpha(theme.palette.warning.light, 0.14)} 100%)`
                  : "linear-gradient(135deg, #fef3e2 0%, #fde8c8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: scaleFont(18, settings?.textSize),
                fontWeight: 800,
                color: isCompleted
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
              })}
            >
              {item.animalName?.charAt(0)?.toUpperCase() ?? "A"}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={(theme) => ({
                  fontSize: scaleFont(16, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                })}
              >
                {item.animalName}
              </Typography>

              <Typography
                noWrap
                sx={(theme) => ({
                  mt: 0.3,
                  fontSize: scaleFont(12.5, settings?.textSize),
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                })}
              >
                {item.serviceType}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={t(`appointment:status.${item.status}`)}
            size="small"
            sx={(theme) => ({
              height: 26,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: scaleFont(11, settings?.textSize),
              letterSpacing: "0.02em",
              ml: 1,
              flexShrink: 0,
              backgroundColor: isCompleted
                ? theme.palette.mode === "dark"
                  ? alpha(theme.palette.success.main, 0.18)
                  : "#dff4f1"
                : theme.palette.mode === "dark"
                ? alpha(theme.palette.warning.main, 0.18)
                : "#f8ecd8",
              color: isCompleted
                ? theme.palette.success.main
                : theme.palette.warning.main,
            })}
          />
        </Stack>

        <Box
          sx={(theme) => ({
            height: "1px",
            backgroundColor: theme.palette.divider,
            mb: 2,
          })}
        />

        <Stack spacing={1} sx={{ mb: 2.25 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <CalendarTodayOutlinedIcon
              sx={(theme) => ({
                fontSize: 15,
                color: isCompleted
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
                opacity: 0.8,
              })}
            />

            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(12.5, settings?.textSize),
                color: theme.palette.text.secondary,
                lineHeight: 1.4,
              })}
            >
              {formatDateTimeBySettings(
                item.slotStartTimeUtc,
                dateFormat,
                t,
                locale
              )}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center">
            <LocalHospitalOutlinedIcon
              sx={(theme) => ({
                fontSize: 15,
                color: theme.palette.text.disabled,
              })}
            />

            <Typography
              noWrap
              sx={(theme) => ({
                fontSize: scaleFont(12.5, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {item.vetCabinetName || "—"}
            </Typography>
          </Stack>

          <Typography
            noWrap
            sx={(theme) => ({
              fontSize: scaleFont(12.5, settings?.textSize),
              color: theme.palette.text.secondary,
            })}
          >
            {item.vetCabinetAddress || "—"}
          </Typography>

          <Stack direction="row" spacing={1.25} alignItems="center">
              <PaymentsOutlinedIcon
                sx={(theme) => ({
                  fontSize: 15,
                  color: theme.palette.text.disabled,
                })}
              />

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(12.5, settings?.textSize),
              color: theme.palette.text.primary,
              fontWeight: 700,
            })}
          >
            {formatCurrency(item.price, item.currency)}
          </Typography>
          </Stack>
        </Stack>

        {isCompleted ? (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              onClick={() =>
                downloadAppointmentPdf(item, t, dateFormat, locale)
              }
              startIcon={
                <DownloadRoundedIcon sx={{ fontSize: "17px !important" }} />
              }
              sx={(theme) => ({
                py: 1,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(12.5, settings?.textSize),
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.14)
                    : "#dff4f1",
                color: theme.palette.success.main,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.2)
                    : alpha(theme.palette.success.main, 0.15)
                }`,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.success.main, 0.22)
                      : "#d2efeb",
                },
              })}
            >
              {t("appointment:downloadReport")}
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              onClick={onEdit}
              startIcon={
                <EditOutlinedIcon sx={{ fontSize: "17px !important" }} />
              }
              sx={(theme) => ({
                py: 1,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(12.5, settings?.textSize),
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.14)
                    : "#dff4f1",
                color: theme.palette.success.main,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.2)
                    : alpha(theme.palette.success.main, 0.15)
                }`,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.success.main, 0.22)
                      : "#d2efeb",
                },
              })}
            >
              {t("appointment:edit") || "Edit"}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};