import { AppBar, Box, Toolbar } from "@mui/material";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNav } from "./NavbarNav";
import { NavbarActions } from "./NavbarActions";

export const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      })}
    >
      <Toolbar
        sx={{
          minHeight: "80px",
          px: { xs: 2, sm: 3, md: 5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 5 },
            minWidth: 0,
            flex: 1,
          }}
        >
          <NavbarLogo />
          <NavbarNav />
        </Box>

        <NavbarActions />
      </Toolbar>
    </AppBar>
  );
};