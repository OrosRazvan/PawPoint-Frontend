import { Box, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

export const ForgotPasswordShell = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #fffaf1 0%, #fff3df 45%, #fde7c2 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 38%), radial-gradient(circle at bottom right, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 42%)",
          pointerEvents: "none",
        }}
      />

      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          px: 2,
          py: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
};