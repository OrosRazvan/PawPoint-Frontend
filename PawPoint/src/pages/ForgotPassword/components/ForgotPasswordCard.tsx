import { Paper } from "@mui/material";
import type { PropsWithChildren } from "react";

export const ForgotPasswordCard = ({ children }: PropsWithChildren) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 520,
        p: { xs: 3, sm: 4.5 },
        borderRadius: "32px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(7, 28, 66, 0.08)",
        boxShadow: "0 24px 60px rgba(7, 28, 66, 0.12)",
      }}
    >
      {children}
    </Paper>
  );
};