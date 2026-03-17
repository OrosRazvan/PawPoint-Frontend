import { Stack, Typography } from "@mui/material";

export const LoginHeader = () => {
  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          color: "#071c42",
        }}
      >
        Login
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: "#6b7280",
        }}
      >
        Enter your credentials to access your account
      </Typography>
    </Stack>
  );
};