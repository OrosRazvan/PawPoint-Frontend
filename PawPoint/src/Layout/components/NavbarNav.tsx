import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Box, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

type NavItemProps = {
  to?: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  hasArrow?: boolean;
};

const NavItem = ({ to = "#", label, icon, active, hasArrow }: NavItemProps) => {
  const Component = to === "#" ? Box : Link;

  return (
    <Button
      component={Component}
      to={to !== "#" ? to : undefined}
      startIcon={icon}
      endIcon={hasArrow ? <KeyboardArrowDownOutlinedIcon /> : undefined}
      sx={{
        px: 2.25,
        py: 1.4,
        borderRadius: 2.5,
        textTransform: "none",
        fontSize: 16,
        fontWeight: 500,
        color: active ? "#111827" : "#4b5563",
        backgroundColor: active ? "#f6ddb0" : "transparent",
        whiteSpace: "nowrap",
        "&:hover": {
          backgroundColor: active ? "#f6ddb0" : "#f8f8f8",
        },
      }}
    >
      {label}
    </Button>
  );
};

export const NavbarNav = () => {
  const { t } = useTranslation(["layout"]);
  const location = useLocation();

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      <NavItem
        to="/"
        label={t("layout:navbar.home")}
        icon={<HomeOutlinedIcon />}
        active={location.pathname === "/"}
      />

      <NavItem
        to="/dashboard"
        label={t("layout:navbar.dashboard")}
        icon={<DashboardOutlinedIcon />}
        active={location.pathname === "/dashboard"}
      />

      <NavItem
        label={t("layout:navbar.management")}
        icon={<Box component="span" sx={{ width: 18, height: 18 }} />}
        hasArrow
      />

      <NavItem
        to="/assistant"
        label={t("layout:navbar.assistant")}
        icon={<SmartToyOutlinedIcon />}
        active={location.pathname === "/assistant"}
      />
    </Stack>
  );
};