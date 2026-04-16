import { Paper } from "@mui/material";

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
        borderRadius: 4,
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
      }}
    >
      {children}
    </Paper>
  );
};