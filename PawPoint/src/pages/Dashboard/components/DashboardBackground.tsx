import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const DashboardBackground = ({ children }: Props) => {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      })}
    >
      {children}
    </Box>
  );
};