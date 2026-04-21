import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const DashboardContainer = ({ children }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        py: { xs: 4, md: 6 },
      }}
    >
      {children}
    </Box>
  );
};