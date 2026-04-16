import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../../auth/tokenStorage";
import { NotificationsDropdown } from "../../components/NotificationsDropdown";
import { getNotificationBadgeMode } from "../../utils/notificationBadgePreference";
import { useSettings } from "../../hooks/useSettings";
import { useUserProfile } from "../../hooks/useUserProfile";
import { scaleFont } from "../../utils/fontScale";

const getInitial = (name?: string | null) => {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

export const NavbarActions = () => {
  const { t } = useTranslation(["layout"]);
  const { data: settings } = useSettings();
  const { data: profile } = useUserProfile();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const showNotificationCount = getNotificationBadgeMode() === "count";
  const menuOpen = Boolean(anchorEl);

  const displayName = useMemo(() => {
    return profile?.fullName?.trim() || t("layout:navbar.profile");
  }, [profile?.fullName, t]);

  const handleLogout = () => {
    clearTokens();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  const handleGoToSettings = () => {
    handleCloseMenu();
    navigate("/settings");
  };

  const handleMenuLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  return (
    <Stack direction="row" spacing={1.2} alignItems="center" flexShrink={0}>
      <NotificationsDropdown showCount={showNotificationCount} />

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
              sx={{
                width: 34,
                height: 34,
              }}
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
          <Box
            sx={(theme) => ({
              px: 2,
              py: 1.6,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha("#ffffff", 0.03)
                  : alpha(theme.palette.primary.main, 0.06),
            })}
          >
            <Stack direction="row" spacing={1.4} alignItems="center">
              {profile?.profilePictureUrl ? (
                <Avatar
                  src={profile.profilePictureUrl}
                  alt={displayName}
                  sx={{ width: 40, height: 40 }}
                />
              ) : (
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    fontSize: scaleFont(15, settings?.textSize),
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    color: theme.palette.mode === "dark" ? "#111827" : "#ffffff",
                  })}
                >
                  {getInitial(profile?.fullName)}
                </Avatar>
              )}

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(15, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  })}
                >
                  {displayName}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    mt: 0.3,
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    lineHeight: 1.2,
                  })}
                >
                  {profile?.email ?? ""}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          <MenuItem
            onClick={handleGoToProfile}
            sx={{ py: 1.4, px: 2, gap: 1.4 }}
          >
            <PersonOutlineOutlinedIcon fontSize="small" />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:navbar.profile")}
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleGoToSettings}
            sx={{ py: 1.4, px: 2, gap: 1.4 }}
          >
            <SettingsOutlinedIcon fontSize="small" />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
              })}
            >
              {t("layout:navbar.settings")}
            </Typography>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleMenuLogout}
            sx={{ py: 1.4, px: 2, gap: 1.4 }}
          >
            <LogoutOutlinedIcon
              fontSize="small"
              color="error"
            />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.error.main,
                fontWeight: 700,
              })}
            >
              {t("layout:navbar.logout")}
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Stack>
  );
};