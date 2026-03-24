import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const DashboardBackground = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f8f4ef",
      }}
    >
      {children}
    </Box>
  );
};