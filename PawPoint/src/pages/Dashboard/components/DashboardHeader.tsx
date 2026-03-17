import { Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle: string;
};

export const DashboardHeader = ({ title, subtitle }: Props) => {
  return (
    <Stack spacing={1} sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontSize: { xs: 34, md: 42 },
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#0b1f44",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 18,
          color: "#3f5878",
        }}
      >
        {subtitle}
      </Typography>
    </Stack>
  );
};