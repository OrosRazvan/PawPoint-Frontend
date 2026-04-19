import { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNav } from "./NavbarNav";
import { NavbarActions } from "./NavbarActions";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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
            gap: 2,
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

            <Box sx={{ display: { xs: "none", md: "flex" }, minWidth: 0 }}>
              <NavbarNav />
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}>
            <NavbarActions />
          </Box>

          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={(theme) => ({
              display: { xs: "inline-flex", md: "none" },
              width: 42,
              height: 42,
              borderRadius: 999,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 20px rgba(0,0,0,0.22)"
                  : "0 6px 16px rgba(0,0,0,0.06)",
            })}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: (theme) => ({
            width: "100%",
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
            borderLeft: `1px solid ${theme.palette.divider}`,
          }),
        }}
      >
        <Stack sx={{ minHeight: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={(theme) => ({
              px: 2,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          >
            <NavbarLogo />

            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={(theme) => ({
                width: 42,
                height: 42,
                borderRadius: 999,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              })}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3} sx={{ p: 2.5 }}>
            <NavbarNav mobile onNavigate={() => setMobileOpen(false)} />
            <NavbarActions mobile onNavigate={() => setMobileOpen(false)} />
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};