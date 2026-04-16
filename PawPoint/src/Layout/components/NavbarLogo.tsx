import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";

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
        sx={(theme) => ({
          width: 40,
          height: 40,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        })}
      >
        <PetsOutlinedIcon fontSize="small" />
      </Box>

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