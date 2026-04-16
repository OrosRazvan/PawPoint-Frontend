import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
      sx={(theme) => ({
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha("#ffffff", 0.03)
            : "#f9f9f9",
      })}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
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
                  ? alpha(theme.palette.secondary.main, 0.16)
                  : "#efe2ff",
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.main
                  : "#8a2be2",
            })}
          >
            <CalendarTodayOutlinedIcon />
          </Box>

          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(18, settings?.textSize),
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                })}
              >
                {petName}
              </Typography>

              <Chip
                label={statusLabel}
                size="small"
                sx={(theme) => ({
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.warning.main, 0.18)
                      : "#f5e3a1",
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.warning.main
                      : "#9a6a00",
                  borderRadius: 999,
                  fontWeight: 500,
                })}
              />
            </Stack>

            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(16, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {typeLabel}
            </Typography>
          </Stack>
        </Stack>

        <Stack alignItems="flex-end">
          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(18, settings?.textSize),
              fontWeight: 700,
              color: theme.palette.text.primary,
            })}
          >
            {dateLabel}
          </Typography>

          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(16, settings?.textSize),
              color: theme.palette.text.secondary,
            })}
          >
            {timeLabel}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};