import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const DashboardContainer = ({ children }: Props) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      {children}
    </Box>
  );
};