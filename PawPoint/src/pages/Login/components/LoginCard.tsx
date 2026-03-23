import { Box, Paper } from "@mui/material";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";

type Props = {
  children: React.ReactNode;
};

export const LoginCard = ({ children }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        p: { xs: 3, sm: 4 },
        pt: { xs: 7, sm: 7 },
        borderRadius: 4,
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
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