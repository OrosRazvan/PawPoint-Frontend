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
import type { AppointmentCardItem } from "../types/appointment";

type Props = {
  item: AppointmentCardItem;
  onEdit?: () => void;
  onDelete?: () => void;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return `${date.toLocaleDateString("ro-RO")} at ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  )}`;
};

export const AppointmentCard = ({ item, onEdit }: Props) => {
  const isCompleted = item.status === "completed";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e7e1d8",
        backgroundColor: "#faf8f5",
        minHeight: 250,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: "#071c42",
                lineHeight: 1.2,
              }}
            >
              {item.animalName}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                color: "#7b8794",
                fontWeight: 500,
              }}
            >
              {item.serviceType}
            </Typography>
          </Box>

          <Chip
            label={item.status}
            size="small"
            sx={{
              height: 30,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 12,
              textTransform: "lowercase",
              backgroundColor: isCompleted ? "#dff4f1" : "#f8ecd8",
              color: isCompleted ? "#57cfc8" : "#f5a623",
            }}
          />
        </Stack>

        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 18, color: "#8a95a3" }}
            />
            <Typography
              sx={{
                fontSize: 13,
                color: "#667085",
              }}
            >
              {formatDateTime(item.slotStartTimeUtc)}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#071c42",
            }}
          >
            {item.vetCabinetName || "—"}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#667085",
            }}
          >
            {item.vetCabinetAddress || "—"}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#071c42",
              fontWeight: 700,
            }}
          >
            {item.priceRon != null ? `${item.priceRon} RON` : "—"}
          </Typography>
        </Stack>

        {!isCompleted && (
          <Stack direction="row" spacing={1.2} sx={{ pt: 1 }}>
            <Button
              fullWidth
              onClick={onEdit}
              sx={{
                py: 1.15,
                borderRadius: 2.5,
                backgroundColor: "#dff4f1",
                color: "#57cfc8",
                minWidth: 0,
                "&:hover": {
                  backgroundColor: "#d2efeb",
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 19 }} />
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};