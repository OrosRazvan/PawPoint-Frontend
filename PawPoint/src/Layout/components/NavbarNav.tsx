import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AssistantOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { getAccessToken } from "../../auth/tokenStorage";

const getIsAdminFromToken = (): boolean => {
  try {
    const token = getAccessToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ??
      payload.role;

    return role === "Admin";
  } catch {
    return false;
  }
};

type NavbarNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export const NavbarNav = ({
  mobile = false,
  onNavigate,
}: NavbarNavProps) => {
  const { t } = useTranslation(["layout"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useSettings();

  const isAdmin = getIsAdminFromToken();

  const [managementAnchor, setManagementAnchor] = useState<null | HTMLElement>(null);
  const managementOpen = Boolean(managementAnchor);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAdminPage = location.pathname.startsWith("/admin");

  const managementActive = useMemo(
    () =>
      location.pathname.startsWith("/vaccinations") ||
      location.pathname.startsWith("/appointments") ||
      location.pathname.startsWith("/deworming"),
    [location.pathname]
  );

  const handleGo = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const navButtonSx = (theme: any) => ({
    px: mobile ? 1.5 : 2,
    py: mobile ? 1.4 : 1.25,
    borderRadius: mobile ? 3 : 999,
    textTransform: "none",
    fontSize: scaleFont(15, settings?.textSize),
    fontWeight: 600,
    color: theme.palette.text.secondary,
    minWidth: "auto",
    justifyContent: "flex-start",
    width: mobile ? "100%" : "auto",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.06)
          : "#f5f5f5",
    },
  });

  if (isAdmin) {
    return (
      <Stack
        direction={mobile ? "column" : "row"}
        spacing={mobile ? 1.25 : 1}
        alignItems={mobile ? "stretch" : "center"}
      >
        <Button
          startIcon={<AdminPanelSettingsOutlinedIcon />}
          onClick={() => handleGo("/admin")}
          sx={(theme) => ({
            ...navButtonSx(theme),
            backgroundColor: isAdminPage
              ? alpha(theme.palette.primary.main, 0.22)
              : "transparent",
            color: isAdminPage
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: isAdminPage
                ? alpha(theme.palette.primary.main, 0.22)
                : theme.palette.mode === "dark"
                ? alpha("#ffffff", 0.06)
                : "#f5f5f5",
            },
          })}
        >
          Admin
        </Button>
      </Stack>
    );
  }

  return (
    <Stack
      direction={mobile ? "column" : "row"}
      spacing={mobile ? 1.25 : 1}
      alignItems={mobile ? "stretch" : "center"}
    >
      <Button
        startIcon={<DashboardOutlinedIcon />}
        onClick={() => handleGo("/dashboard")}
        sx={(theme) => ({
          ...navButtonSx(theme),
          backgroundColor: isDashboard
            ? alpha(theme.palette.primary.main, 0.22)
            : "transparent",
          color: isDashboard
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: isDashboard
              ? alpha(theme.palette.primary.main, 0.22)
              : theme.palette.mode === "dark"
              ? alpha("#ffffff", 0.06)
              : "#f5f5f5",
          },
        })}
      >
        {t("layout:dashboard")}
      </Button>

      <Button
        endIcon={
          managementOpen ? (
            <KeyboardArrowUpRoundedIcon />
          ) : (
            <KeyboardArrowDownRoundedIcon />
          )
        }
        onClick={(e) => setManagementAnchor(e.currentTarget)}
        sx={(theme) => ({
          ...navButtonSx(theme),
          backgroundColor: managementActive
            ? alpha(theme.palette.primary.main, 0.16)
            : "transparent",
          color: managementActive
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: managementActive
              ? alpha(theme.palette.primary.main, 0.16)
              : theme.palette.mode === "dark"
              ? alpha("#ffffff", 0.06)
              : "#f5f5f5",
          },
        })}
      >
        {t("layout:management")}
      </Button>

      <Menu
        anchorEl={managementAnchor}
        open={managementOpen}
        onClose={() => setManagementAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: mobile ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: mobile ? "right" : "left",
        }}
        PaperProps={{
          sx: (theme) => ({
            mt: 1.2,
            minWidth: 240,
            borderRadius: 3,
            p: 1,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 16px 36px rgba(0,0,0,0.36)"
                : "0 12px 32px rgba(7,28,66,0.12)",
          }),
        }}
      >
        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            handleGo("/vaccinations");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VaccinesOutlinedIcon sx={(theme) => ({ color: theme.palette.text.secondary })} />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:vaccinations")}
            </Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            handleGo("/appointments");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <EventAvailableOutlinedIcon sx={(theme) => ({ color: theme.palette.text.secondary })} />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:appointments")}
            </Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            handleGo("/deworming");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BugReportOutlinedIcon sx={(theme) => ({ color: theme.palette.text.secondary })} />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:deworming")}
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Button
        startIcon={<AssistantOutlinedIcon />}
        sx={navButtonSx}
      >
        {t("layout:assistant")}
      </Button>

      {mobile && <Box sx={{ height: 4 }} />}
    </Stack>
  );
};