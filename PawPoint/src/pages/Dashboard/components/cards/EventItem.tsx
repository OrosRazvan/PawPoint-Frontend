import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";

type Props = {
  petName: string;
  typeLabel: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
};

export const EventItem = ({
  petName,
  typeLabel,
  statusLabel,
  dateLabel,
  timeLabel,
}: Props) => {
  const { data: settings } = useSettings();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #dddddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#efe2ff",
              color: "#8a2be2",
            }}
          >
            <CalendarTodayOutlinedIcon />
          </Box>

          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  color: "#071c42",
                }}
              >
                {petName}
              </Typography>

              <Chip
                label={statusLabel}
                size="small"
                sx={{
                  backgroundColor: "#f5e3a1",
                  color: "#9a6a00",
                  borderRadius: 999,
                  fontWeight: 500,
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontSize: scaleFont(16, settings?.textSize),
                color: "#43556f",
              }}
            >
              {typeLabel}
            </Typography>
          </Stack>
        </Stack>

        <Stack alignItems="flex-end">
          <Typography
            sx={{
              fontSize: scaleFont(18, settings?.textSize),
              fontWeight: 700,
              color: "#071c42",
            }}
          >
            {dateLabel}
          </Typography>

          <Typography
            sx={{
              fontSize: scaleFont(16, settings?.textSize),
              color: "#43556f",
            }}
          >
            {timeLabel}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};