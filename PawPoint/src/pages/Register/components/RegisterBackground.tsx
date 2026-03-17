import { Box, Stack, Typography } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const RegisterBackground = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        backgroundColor: "#fbf2ea", // crem ca în poză
      }}
    >
      {/* LEFT HERO */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "none", md: "block" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={new URL("../assets/register-hero.jpg", import.meta.url).toString()}
          alt="Pets"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(1.05)",
          }}
        />

        {/* Bottom text */}
        <Stack
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 5,
            pt: 10,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.0))",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome to PawPoint!
          </Typography>
        </Stack>

        {/* Small pill top-left (optional) */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Friendly care
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};