import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { clearTokens, getAccessToken } from "../../auth/tokenStorage";
import { NotificationsDropdown } from "../../components/NotificationsDropdown";
import { getNotificationBadgeMode } from "../../utils/notificationBadgePreference";
import { useSettings } from "../../hooks/useSettings";
import { useUserProfile } from "../../hooks/useUserProfile";
import { scaleFont } from "../../utils/fontScale";
import { useAdminContactMessages } from "../../hooks/useAdminContactMessages";

const getInitial = (name?: string | null) => {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

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

type NavbarActionsProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export const NavbarActions = ({
  mobile = false,
  onNavigate,
}: NavbarActionsProps) => {
  const { t } = useTranslation(["layout"]);
  const { data: settings } = useSettings();
  const { data: profile } = useUserProfile();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const showNotificationCount = getNotificationBadgeMode() === "count";
  const menuOpen = Boolean(anchorEl);
  const isAdmin = getIsAdminFromToken();

  const { data: adminMessages = [] } = useAdminContactMessages(isAdmin);
  const unansweredCount = isAdmin
    ? adminMessages.filter((x) => x.status === "Open" || x.replies.length === 0).length
    : 0;

  const displayName = useMemo(() => {
    return profile?.fullName?.trim() || t("layout:navbar.profile");
  }, [profile?.fullName, t]);

  const actionIconButtonSx = (theme: any) => ({
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
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.05)
          : alpha(theme.palette.text.primary, 0.04),
    },
  });

  const mobileActionButtonSx = (theme: any) => ({
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 3,
    textTransform: "none",
    fontWeight: 600,
    px: 1.5,
    py: 1.25,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.05)
          : alpha(theme.palette.text.primary, 0.04),
    },
  });

  const handleLogout = () => {
    clearTokens();
    sessionStorage.clear();
    window.location.replace("/");
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleCloseMenu();
    onNavigate?.();
    navigate("/profile");
  };

  const handleGoToSettings = () => {
    handleCloseMenu();
    onNavigate?.();
    navigate("/settings");
  };

  const handleMenuLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  if (mobile) {
    return (
      <Stack spacing={1.25}>
        {!isAdmin && (
          <Box>
            <NotificationsDropdown showCount={showNotificationCount} />
          </Box>
        )}

        {!isAdmin && (
          <Button
            startIcon={<ContactSupportOutlinedIcon />}
            onClick={() => {
              onNavigate?.();
              navigate("/contact-us");
            }}
            sx={mobileActionButtonSx}
          >
            {t("layout:navbar.contactUs")}
          </Button>
        )}

        {!isAdmin && (
          <Button
            startIcon={<MailOutlineRoundedIcon />}
            onClick={() => {
              onNavigate?.();
              navigate("/my-contact-messages");
            }}
            sx={mobileActionButtonSx}
          >
            {t("layout:navbar.myMessages")}
          </Button>
        )}

        {isAdmin && (
          <Button
            startIcon={
              <Badge
                color="error"
                badgeContent={unansweredCount}
                invisible={unansweredCount <= 0}
              >
                <AdminPanelSettingsOutlinedIcon color="primary" />
              </Badge>
            }
            onClick={() => {
              onNavigate?.();
              navigate("/admin/contact-messages");
            }}
            sx={mobileActionButtonSx}
          >
            {t("layout:navbar.adminMessages")}
          </Button>
        )}

        <Divider sx={{ my: 1 }} />

        <Button
          onClick={handleOpenMenu}
          sx={(theme) => ({
            ...mobileActionButtonSx(theme),
            justifyContent: "space-between",
          })}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            {profile?.profilePictureUrl ? (
              <Avatar
                src={profile.profilePictureUrl}
                alt={displayName}
                sx={{ width: 34, height: 34 }}
              />
            ) : (
              <Avatar
                sx={(theme) => ({
                  width: 34,
                  height: 34,
                  fontSize: scaleFont(14, settings?.textSize),
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  color: theme.palette.mode === "dark" ? "#111827" : "#ffffff",
                })}
              >
                {getInitial(profile?.fullName)}
              </Avatar>
            )}

            <Typography sx={{ fontWeight: 700, color: "inherit" }}>
              {displayName}
            </Typography>
          </Stack>

          <KeyboardArrowDownRoundedIcon />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: (theme) => ({
              mt: 1.2,
              minWidth: 240,
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 18px 42px rgba(0,0,0,0.36)"
                  : "0 16px 40px rgba(7,28,66,0.12)",
            }),
          }}
        >
          <MenuItem onClick={handleGoToProfile}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PersonOutlineOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.profile")}</Typography>
            </Stack>
          </MenuItem>

          <MenuItem onClick={handleGoToSettings}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <SettingsOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.settings")}</Typography>
            </Stack>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleMenuLogout}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogoutOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.logout")}</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.2} alignItems="center" flexShrink={0}>
      {!isAdmin && <NotificationsDropdown showCount={showNotificationCount} />}

      {!isAdmin && (
        <Tooltip title={t("layout:navbar.contactUs")}>
          <IconButton
            onClick={() => navigate("/contact-us")}
            sx={actionIconButtonSx}
          >
            <ContactSupportOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}

      {!isAdmin && (
        <Tooltip title={t("layout:navbar.myMessages")}>
          <IconButton
            onClick={() => navigate("/my-contact-messages")}
            sx={actionIconButtonSx}
          >
            <MailOutlineRoundedIcon />
          </IconButton>
        </Tooltip>
      )}

      {isAdmin && (
        <Tooltip title={t("layout:navbar.adminMessages")}>
          <IconButton
            onClick={() => navigate("/admin/contact-messages")}
            sx={actionIconButtonSx}
          >
            <Badge
              color="error"
              badgeContent={unansweredCount}
              invisible={unansweredCount <= 0}
            >
              <AdminPanelSettingsOutlinedIcon color="primary" />
            </Badge>
          </IconButton>
        </Tooltip>
      )}

      <Box>
        <IconButton
          onClick={handleOpenMenu}
          sx={(theme) => ({
            p: 0.6,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 20px rgba(0,0,0,0.22)"
                : "0 6px 16px rgba(0,0,0,0.06)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha("#ffffff", 0.05)
                  : alpha(theme.palette.text.primary, 0.04),
            },
          })}
        >
          {profile?.profilePictureUrl ? (
            <Avatar
              src={profile.profilePictureUrl}
              alt={displayName}
              sx={{ width: 34, height: 34 }}
            />
          ) : (
            <Avatar
              sx={(theme) => ({
                width: 34,
                height: 34,
                fontSize: scaleFont(14, settings?.textSize),
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                color: theme.palette.mode === "dark" ? "#111827" : "#ffffff",
              })}
            >
              {getInitial(profile?.fullName)}
            </Avatar>
          )}

          <KeyboardArrowDownRoundedIcon
            sx={(theme) => ({
              fontSize: 20,
              color: theme.palette.text.secondary,
              mr: 0.2,
            })}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: (theme) => ({
              mt: 1.2,
              minWidth: 240,
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 18px 42px rgba(0,0,0,0.36)"
                  : "0 16px 40px rgba(7,28,66,0.12)",
            }),
          }}
        >
          <MenuItem onClick={handleGoToProfile}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PersonOutlineOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.profile")}</Typography>
            </Stack>
          </MenuItem>

          <MenuItem onClick={handleGoToSettings}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <SettingsOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.settings")}</Typography>
            </Stack>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleMenuLogout}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogoutOutlinedIcon fontSize="small" />
              <Typography>{t("layout:navbar.logout")}</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Box>
    </Stack>
  );
};