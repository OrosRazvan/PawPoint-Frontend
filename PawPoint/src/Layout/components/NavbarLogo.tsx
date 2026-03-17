import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const NavbarLogo = () => {
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
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6b01e",
          color: "#111827",
        }}
      >
        <PetsOutlinedIcon fontSize="small" />
      </Box>

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0b1739",
          lineHeight: 1,
        }}
      >
        PawPoint
      </Typography>
    </Stack>
  );
};