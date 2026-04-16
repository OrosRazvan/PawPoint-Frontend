import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { alpha } from "@mui/material/styles";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { AppointmentCardItem } from "../types/appointment";

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

const formatTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateTimeBySettings = (
  value?: string | null,
  format: AppDateFormat = "DD/MM/YYYY"
) => {
  if (!value) return "—";
  return `${formatDateBySettings(value, format)} at ${formatTime(value)}`;
};

export const AppointmentCard = ({ item, onEdit }: Props) => {
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
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha("#ffffff", 0.03)
            : "#faf8f5",
        minHeight: 250,
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
              {item.serviceType}
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
                ? alpha(theme.palette.success.main, 0.16)
                : alpha(theme.palette.primary.main, 0.16),
              color: isCompleted
                ? theme.palette.success.main
                : theme.palette.primary.main,
            })}
          />
        </Stack>

        <Stack spacing={1.2}>
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
              {formatDateTimeBySettings(item.slotStartTimeUtc, dateFormat)}
            </Typography>
          </Stack>

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(13, settings?.textSize),
              fontWeight: 700,
              color: theme.palette.text.primary,
            })}
          >
            {item.vetCabinetName || "—"}
          </Typography>

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(13, settings?.textSize),
              color: theme.palette.text.secondary,
            })}
          >
            {item.vetCabinetAddress || "—"}
          </Typography>

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(13, settings?.textSize),
              color: theme.palette.text.primary,
              fontWeight: 700,
            })}
          >
            {item.priceRon != null ? `${item.priceRon} RON` : "—"}
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
                backgroundColor: alpha(theme.palette.success.main, 0.14),
                color: theme.palette.success.main,
                minWidth: 0,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.success.main, 0.22),
                },
              })}
            >
              <EditOutlinedIcon sx={{ fontSize: 19 }} />
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};