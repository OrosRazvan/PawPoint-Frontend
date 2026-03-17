import { Stack, Typography } from "@mui/material";

type Props = {
  onLoginClick: () => void;
};

export const HaveAccountText = ({ onLoginClick }: Props) => {
  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
        Do you have an account?
      </Typography>

      <Typography
        onClick={onLoginClick}
        sx={{
          fontSize: 12.5,
          fontWeight: 700,
          color: "#f5a623",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Login
      </Typography>
    </Stack>
  );
};