import { useMemo, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AssistantOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navButtonSx = {
  px: 2,
  py: 1.25,
  borderRadius: 999,
  textTransform: "none",
  fontSize: 15,
  fontWeight: 600,
  color: "#4b5563",
  minWidth: "auto",
};

export const NavbarNav = () => {
  const { t } = useTranslation(["layout"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [managementAnchor, setManagementAnchor] = useState<null | HTMLElement>(null);

  const managementOpen = Boolean(managementAnchor);

  const isDashboard = location.pathname.startsWith("/dashboard");

  const managementActive = useMemo(
    () =>
      location.pathname.startsWith("/vaccinations") ||
      location.pathname.startsWith("/appointments") ||
      location.pathname.startsWith("/deworming"),
    [location.pathname]
  );

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        startIcon={<HomeOutlinedIcon />}
        sx={navButtonSx}
      >
        {t("layout:home")}
      </Button>

      <Button
        startIcon={<DashboardOutlinedIcon />}
        onClick={() => navigate("/dashboard")}
        sx={{
          ...navButtonSx,
          backgroundColor: isDashboard ? "#efd39d" : "transparent",
          color: isDashboard ? "#071c42" : "#4b5563",
          "&:hover": {
            backgroundColor: isDashboard ? "#efd39d" : "#f5f5f5",
          },
        }}
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
        sx={{
          ...navButtonSx,
          backgroundColor: managementActive ? "#f2e4c3" : "transparent",
          color: managementActive ? "#071c42" : "#4b5563",
          "&:hover": {
            backgroundColor: managementActive ? "#f2e4c3" : "#f5f5f5",
          },
        }}
      >
        {t("layout:management")}
      </Button>

      <Menu
        anchorEl={managementAnchor}
        open={managementOpen}
        onClose={() => setManagementAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1.2,
            minWidth: 240,
            borderRadius: 3,
            p: 1,
            boxShadow: "0 12px 32px rgba(7,28,66,0.12)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            navigate("/vaccinations");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VaccinesOutlinedIcon sx={{ color: "#6b7280" }} />
            <Typography>{t("layout:vaccinations")}</Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            navigate("/appointments");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <EventAvailableOutlinedIcon sx={{ color: "#6b7280" }} />
            <Typography>{t("layout:appointments")}</Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setManagementAnchor(null);
            navigate("/deworming");
          }}
          sx={{ borderRadius: 2, py: 1.2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BugReportOutlinedIcon sx={{ color: "#6b7280" }} />
            <Typography>{t("layout:deworming")}</Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Button
        startIcon={<AssistantOutlinedIcon />}
        sx={navButtonSx}
      >
        {t("layout:assistant")}
      </Button>
    </Stack>
  );
};