import { Stack, Typography } from "@mui/material";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";

type Props = {
  title: string;
  subtitle: string;
};

export const DashboardHeader = ({ title, subtitle }: Props) => {
  const { data: settings } = useSettings();

  return (
    <Stack spacing={1} sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontSize: {
            xs: scaleFont(34, settings?.textSize),
            md: scaleFont(42, settings?.textSize),
          },
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#0b1f44",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: scaleFont(18, settings?.textSize),
          color: "#3f5878",
        }}
      >
        {subtitle}
      </Typography>
    </Stack>
  );
};