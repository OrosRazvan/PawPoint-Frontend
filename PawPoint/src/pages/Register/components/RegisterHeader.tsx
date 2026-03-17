import { Box, Stack, Typography } from "@mui/material";

export const RegisterHeader = () => {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          component="img"
          src={new URL("../assets/logo.svg", import.meta.url).toString()}
          alt="Logo"
          sx={{ width: 28, height: 28 }}
        />
        <Typography sx={{ fontWeight: 800 }}>PawPoint</Typography>
      </Stack>

      <Stack spacing={0.5}>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          Sign Up
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          Create an account to manage your pets
        </Typography>
      </Stack>
    </Stack>
  );
};