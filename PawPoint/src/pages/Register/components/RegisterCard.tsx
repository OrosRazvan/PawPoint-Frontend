import { Paper } from "@mui/material";

type Props = { children: React.ReactNode };

export const RegisterCard = ({ children }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        backgroundColor: "white",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </Paper>
  );
};