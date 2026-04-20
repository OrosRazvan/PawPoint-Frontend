import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../hooks/useNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useNotificationRealtime } from "../hooks/useNotificationRealtime";
import { useSettings } from "../hooks/useSettings";
import { scaleFont } from "../utils/fontScale";
import type { NotificationDto } from "../pages/Notifications/types/notification";

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type Props = {
  showCount?: boolean;
};

const extractNotifications = (data: unknown): NotificationDto[] => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data as NotificationDto[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    return (data as { items: NotificationDto[] }).items;
  }

  return [];
};

const shouldShowNotificationInNavbar = (
  notification: NotificationDto,
  settings: {
    enableNotifications?: boolean;
    vaccinationNotifications?: boolean;
    appointmentNotifications?: boolean;
    dewormingNotifications?: boolean;
  } | undefined
) => {
  if (!settings?.enableNotifications) {
    return false;
  }

  const typeName = notification.typeName ?? "";

  if (typeName.startsWith("Vaccination")) {
    return !!settings.vaccinationNotifications;
  }

  if (typeName.startsWith("Appointment")) {
    return !!settings.appointmentNotifications;
  }

  if (typeName.startsWith("Deworming")) {
    return !!settings.dewormingNotifications;
  }

  return true;
};

export const NotificationsDropdown = ({ showCount = true }: Props) => {
  const { t } = useTranslation("notifications");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useNotificationRealtime();

  const { data, isLoading } = useNotifications({
    pageNumber: 1,
    pageSize: 20,
  });

  const { data: settings } = useSettings();
  const { mutate: markAsRead } = useMarkNotificationRead();

  const allNotifications = useMemo(() => extractNotifications(data), [data]);

  const navbarNotifications = useMemo(
    () =>
      allNotifications.filter((item) =>
        shouldShowNotificationInNavbar(item, settings)
      ),
    [allNotifications, settings]
  );

  const notifications = useMemo(
    () => navbarNotifications.slice(0, 4),
    [navbarNotifications]
  );

  const unreadEnabledCount = useMemo(
    () => navbarNotifications.filter((item) => !item.isRead).length,
    [navbarNotifications]
  );

  const anyUnreadAtAll = useMemo(
    () => allNotifications.some((item) => !item.isRead),
    [allNotifications]
  );

  const allCategoriesOff =
    !!settings?.enableNotifications &&
    !settings?.vaccinationNotifications &&
    !settings?.appointmentNotifications &&
    !settings?.dewormingNotifications;

  const showDotOnly =
    settings?.enableNotifications &&
    (settings?.notificationBadgeMode === "dot" || allCategoriesOff);

  const badgeInvisible = !settings?.enableNotifications
    ? true
    : showDotOnly
    ? !anyUnreadAtAll
    : unreadEnabledCount === 0;

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          display: "inline-flex",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha("#ffffff", 0.06)
                : alpha(theme.palette.text.primary, 0.05),
          },
        })}
      >
        <Badge
          color="error"
          badgeContent={
            showCount &&
            settings?.enableNotifications &&
            !showDotOnly &&
            unreadEnabledCount > 0
              ? unreadEnabledCount
              : undefined
          }
          variant={showDotOnly ? "dot" : "standard"}
          overlap="circular"
          invisible={badgeInvisible}
        >
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: (theme) => ({
            mt: 1.5,
            width: 430,
            borderRadius: 4,
            overflow: "hidden",
            p: 0,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 16px 40px rgba(0,0,0,0.36)"
                : "0 16px 40px rgba(7,28,66,0.14)",
          }),
        }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(18, settings?.textSize),
                fontWeight: 800,
                color: theme.palette.text.primary,
              })}
            >
              {t("title")}
            </Typography>

            {unreadEnabledCount > 0 && (
              <Chip
                label={showDotOnly ? "•" : unreadEnabledCount}
                size="small"
                sx={(theme) => ({
                  borderRadius: 999,
                  fontWeight: 700,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.error.main, 0.18)
                      : alpha(theme.palette.error.main, 0.12),
                  color: theme.palette.error.main,
                })}
              />
            )}
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
          {isLoading ? (
            <Box sx={{ px: 3, py: 3 }}>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: scaleFont(15, settings?.textSize),
                })}
              >
                {t("loading")}
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ px: 3, py: 4 }}>
              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: scaleFont(15, settings?.textSize),
                })}
              >
                {t("empty")}
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider flexItem />}>
              {notifications.map((item) => (
                <Box
                  key={item.id}
                  sx={(theme) => ({
                    px: 3,
                    py: 2,
                    backgroundColor: item.isRead
                      ? "transparent"
                      : theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.primary.main, 0.05),
                  })}
                >
                  <Stack spacing={1.2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ minWidth: 0 }}>
                        {!item.isRead && (
                          <CircleIcon
                            sx={(theme) => ({
                              fontSize: 10,
                              mt: 0.8,
                              color: theme.palette.error.main,
                            })}
                          />
                        )}

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={(theme) => ({
                              fontSize: scaleFont(15, settings?.textSize),
                              fontWeight: item.isRead ? 700 : 800,
                              color: theme.palette.text.primary,
                              lineHeight: 1.35,
                            })}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            sx={(theme) => ({
                              mt: 0.5,
                              fontSize: scaleFont(14, settings?.textSize),
                              color: theme.palette.text.secondary,
                              lineHeight: 1.45,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            })}
                          >
                            {item.content}
                          </Typography>

                          <Typography
                            sx={(theme) => ({
                              mt: 0.8,
                              fontSize: scaleFont(12, settings?.textSize),
                              color: alpha(theme.palette.text.secondary, 0.8),
                            })}
                          >
                            {formatDate(item.createdAt)}
                          </Typography>
                        </Box>
                      </Stack>

                      {!item.isRead && (
                        <Button
                          size="small"
                          onClick={() => markAsRead(item.id)}
                          sx={{
                            minWidth: "auto",
                            px: 1,
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                          }}
                        >
                          {t("markAsRead")}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setAnchorEl(null);
              navigate("/notifications");
            }}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              py: 1.3,
            }}
          >
            {t("seeAll")}
          </Button>
        </Box>
      </Menu>
    </>
  );
};