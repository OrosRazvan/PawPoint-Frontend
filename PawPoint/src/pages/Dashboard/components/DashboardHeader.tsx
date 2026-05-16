import { Box, Stack, Typography } from "@mui/material";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";

type Props = {
  title: string;
};

export const DashboardHeader = ({ title }: Props) => {
  const { data: settings } = useSettings();

  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: scaleFont(36, settings?.textSize),
              md: scaleFont(48, settings?.textSize),
            },
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            color: theme.palette.text.primary,
            "& span": {
              background: "linear-gradient(135deg, #f59e0b 0%, #4f83ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            },
          })}
        >
          {title}
        </Typography>
      </Box>
    </Stack>
  );
};