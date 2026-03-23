import { Box, Paper } from "@mui/material";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";

type Props = { children: React.ReactNode };

export const RegisterCard = ({ children }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        p: { xs: 3, sm: 4 },
        pt: { xs: 7, sm: 7 },
        borderRadius: 4,
        backgroundColor: "white",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <LanguageSwitcher />
      </Box>

      {children}
    </Paper>
  );
};