import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { VaccinationCardItem } from "../types/vaccination";

type Props = {
  item: VaccinationCardItem;
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

export const VaccinationCard = ({ item, onEdit, onDelete }: Props) => {
  const { t } = useTranslation(["vaccination"]);
  const isCompleted = item.status === "completed";
  const { data: settings } = useSettings();

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        minHeight: 205,
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
      {/* Colored top accent strip */}
      <Box
        sx={(theme) => ({
          height: 4,
          background: isCompleted
            ? `linear-gradient(90deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.4)})`
            : `linear-gradient(90deg, ${theme.palette.warning.main}, ${alpha(theme.palette.warning.main, 0.4)})`,
        })}
      />

      <Stack spacing={0} sx={{ p: 2.75 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.75} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={(theme) => ({
                width: 44,
                height: 44,
                borderRadius: 2.5,
                flexShrink: 0,
                background: isCompleted
                  ? theme.palette.mode === "dark"
                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.22)} 0%, ${alpha(theme.palette.success.light, 0.14)} 100%)`
                    : "linear-gradient(135deg, #dff4f1 0%, #c8ede8 100%)"
                  : theme.palette.mode === "dark"
                  ? `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.22)} 0%, ${alpha(theme.palette.warning.light, 0.14)} 100%)`
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
              {item.animalName?.charAt(0)?.toUpperCase() ?? "V"}
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
                {item.vaccineName}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={t(`vaccination:status.${item.status}`)}
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

        {/* Divider */}
        <Box
          sx={(theme) => ({
            height: "1px",
            backgroundColor: theme.palette.divider,
            mb: 2,
          })}
        />

        {/* Info rows */}
        <Stack spacing={1} sx={{ mb: isCompleted ? 0 : 2.25 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <CalendarTodayOutlinedIcon
              sx={(theme) => ({
                fontSize: 15,
                color: isCompleted ? theme.palette.success.main : theme.palette.warning.main,
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
              {isCompleted
                ? t("vaccination:givenOn", {
                    date: formatDateBySettings(
                      item.lastDate ?? item.slotStartTimeUtc,
                      dateFormat
                    ),
                  })
                : t("vaccination:scheduledOn", {
                    date: formatDateBySettings(
                      item.slotStartTimeUtc,
                      dateFormat
                    ),
                  })}
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
              {t("vaccination:veterinarianLabel", {
                value: item.vetCabinetName || "—",
              })}
            </Typography>
          </Stack>
        </Stack>

        {/* Action buttons */}
        {!isCompleted && (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              onClick={onEdit}
              startIcon={<EditOutlinedIcon sx={{ fontSize: "17px !important" }} />}
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
              {t("vaccination:edit") || "Edit"}
            </Button>

            <Button
              fullWidth
              onClick={onDelete}
              startIcon={<DeleteOutlineOutlinedIcon sx={{ fontSize: "17px !important" }} />}
              sx={(theme) => ({
                py: 1,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(12.5, settings?.textSize),
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.12)
                    : "#fdeaea",
                color: theme.palette.error.main,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.error.main, 0.12)
                }`,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.error.main, 0.2)
                      : "#f8d6d6",
                },
              })}
            >
              {t("vaccination:delete") || "Delete"}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};