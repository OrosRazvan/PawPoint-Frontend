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
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22,87,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(5,165,51,0.05) 0%, transparent 50%)"
            : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22,87,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(245,158,11,0.06) 0%, transparent 50%)",
      })}
    >
      {children}
    </Box>
  );
};