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
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../hooks/useNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useNotificationRealtime } from "../hooks/useNotificationRealtime";
import { useSettings } from "../hooks/useSettings";
import { filterNotificationsForNavbar } from "../utils/filterNotificationsBySettings";
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

export const NotificationsDropdown = ({ showCount = true }: Props) => {
  const { t } = useTranslation(["notifications"]);
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
    () => filterNotificationsForNavbar(allNotifications, settings),
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
        sx={{ color: "#6b7280", display: { xs: "none", md: "inline-flex" } }}
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
          sx: {
            mt: 1.5,
            width: 430,
            borderRadius: 4,
            overflow: "hidden",
            p: 0,
            boxShadow: "0 16px 40px rgba(7,28,66,0.14)",
          },
        }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#071c42" }}>
              {t("notifications:title")}
            </Typography>

            {settings?.enableNotifications && !showDotOnly && unreadEnabledCount > 0 && (
              <Chip
                label={t("notifications:unreadCount", { count: unreadEnabledCount })}
                size="small"
                sx={{
                  backgroundColor: "#fde8e8",
                  color: "#d92d20",
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>
        </Box>

        <Divider />

        <Stack sx={{ maxHeight: 360, overflowY: "auto" }}>
          {isLoading ? (
            <Box sx={{ px: 3, py: 3 }}>
              <Typography sx={{ color: "#667085" }}>
                {t("notifications:loading")}
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ px: 3, py: 3 }}>
              <Typography sx={{ color: "#667085" }}>
                {t("notifications:empty")}
              </Typography>
            </Box>
          ) : (
            notifications.map((item) => (
              <Box
                key={item.id}
                onClick={() => {
                  if (!item.isRead) {
                    markAsRead(item.id);
                  }
                }}
                sx={{
                  px: 3,
                  py: 2.2,
                  cursor: "pointer",
                  backgroundColor: item.isRead ? "#f7f7f7" : "#ffffff",
                  borderBottom: "1px solid #f1ece6",
                  "&:hover": {
                    backgroundColor: item.isRead ? "#f1f1f1" : "#faf6ef",
                  },
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                  {!item.isRead && (
                    <CircleIcon sx={{ fontSize: 10, color: "#d92d20", mt: 0.7 }} />
                  )}

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: item.isRead ? 600 : 800,
                        color: item.isRead ? "#667085" : "#111827",
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 13,
                        color: item.isRead ? "#98a2b3" : "#475467",
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.content}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: 12,
                        color: "#98a2b3",
                      }}
                    >
                      {formatDate(item.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))
          )}
        </Stack>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            onClick={() => {
              setAnchorEl(null);
              navigate("/notifications");
            }}
            sx={{
              py: 1.2,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              color: "#071c42",
              backgroundColor: "#f6efe4",
              "&:hover": {
                backgroundColor: "#efe4d2",
              },
            }}
          >
            {t("notifications:seeAll")}
          </Button>
        </Box>
      </Menu>
    </>
  );
};