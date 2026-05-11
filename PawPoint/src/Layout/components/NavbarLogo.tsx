import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import logo from "../../assets/logo.jpg";

export const NavbarLogo = () => {
  const { data: settings } = useSettings();

  return (
    <Stack
      component={Link}
      to="/dashboard"
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        textDecoration: "none",
        color: "inherit",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="PawPoint Logo"
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2.5,
          objectFit: "cover",
        }}
      />

      <Typography
        sx={(theme) => ({
          fontSize: scaleFont(22, settings?.textSize),
          fontWeight: 800,
          color: theme.palette.text.primary,
          lineHeight: 1,
        })}
      >
        PawPoint
      </Typography>
    </Stack>
  );
};