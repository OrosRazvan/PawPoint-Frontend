import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
  const isCompleted = item.status === "completed";
  const { data: settings } = useSettings();

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 3,
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        minHeight: 205,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 22px rgba(0,0,0,0.24)"
            : "0 2px 16px rgba(7,28,66,0.05)",
      })}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(18, settings?.textSize),
                fontWeight: 800,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              })}
            >
              {item.animalName}
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1,
                fontSize: scaleFont(13, settings?.textSize),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              })}
            >
              {item.vaccineName}
            </Typography>
          </Box>

          <Chip
            label={item.status}
            size="small"
            sx={(theme) => ({
              height: 30,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: scaleFont(12, settings?.textSize),
              textTransform: "lowercase",
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

        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <CalendarTodayOutlinedIcon
              sx={(theme) => ({
                fontSize: 18,
                color: theme.palette.text.secondary,
              })}
            />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {isCompleted
                ? `Given: ${formatDateBySettings(
                    item.lastDate ?? item.slotStartTimeUtc,
                    dateFormat
                  )}`
                : `Scheduled: ${formatDateBySettings(
                    item.slotStartTimeUtc,
                    dateFormat
                  )}`}
            </Typography>
          </Stack>

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(13, settings?.textSize),
              color: theme.palette.text.secondary,
            })}
          >
            Veterinarian: {item.vetCabinetName || "—"}
          </Typography>
        </Stack>

        {!isCompleted && (
          <Stack direction="row" spacing={1.2} sx={{ pt: 1 }}>
            <Button
              fullWidth
              onClick={onEdit}
              sx={(theme) => ({
                py: 1.15,
                borderRadius: 2.5,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.success.main, 0.16)
                    : "#dff4f1",
                color: theme.palette.success.main,
                minWidth: 0,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.success.main, 0.24)
                      : "#d2efeb",
                },
              })}
            >
              <EditOutlinedIcon sx={{ fontSize: 19 }} />
            </Button>

            <IconButton
              onClick={onDelete}
              sx={(theme) => ({
                flex: 1,
                width: "100%",
                borderRadius: 2.5,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.14)
                    : "#f8dede",
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.error.main, 0.22)
                      : "#f3d3d3",
                },
              })}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};