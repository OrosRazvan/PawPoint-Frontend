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
        sx={(theme) => ({
          fontSize: {
            xs: scaleFont(34, settings?.textSize),
            md: scaleFont(42, settings?.textSize),
          },
          fontWeight: 800,
          lineHeight: 1.1,
          color: theme.palette.text.primary,
        })}
      >
        {title}
      </Typography>

      <Typography
        sx={(theme) => ({
          fontSize: scaleFont(18, settings?.textSize),
          color: theme.palette.text.secondary,
        })}
      >
        {subtitle}
      </Typography>
    </Stack>
  );
};