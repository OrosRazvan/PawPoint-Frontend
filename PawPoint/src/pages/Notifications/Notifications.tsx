import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import { useDeleteNotification } from "../../hooks/useDeleteNotification";
import { useNotificationRealtime } from "../../hooks/useNotificationRealtime";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { getAccessToken } from "../../auth/tokenStorage";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Notifications = () => {
  const token = getAccessToken();
  const { t } = useTranslation("notifications");
  const { data: settings } = useSettings();

  if (token) {
    useNotificationRealtime();
  }

  const { data, isLoading, isError } = useNotifications({
    pageNumber: 1,
    pageSize: 20,
  });

  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = data?.items ?? [];

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      })}
    >
      <Stack spacing={4}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: scaleFont(34, settings?.textSize),
              md: scaleFont(42, settings?.textSize),
            },
            fontWeight: 800,
            color: theme.palette.text.primary,
          })}
        >
          {t("title")}
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("loadError")}</Typography>
        ) : notifications.length === 0 ? (
          <Typography
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              fontSize: scaleFont(16, settings?.textSize),
            })}
          >
            {t("empty")}
          </Typography>
        ) : (
          <Stack spacing={2.2}>
            {notifications.map((item: typeof notifications[number]) => (
              <Box
                key={item.id}
                sx={(theme) => ({
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: item.isRead
                    ? theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.03)
                      : "#f5f5f5"
                    : theme.palette.background.paper,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 20px rgba(0,0,0,0.22)"
                      : "0 8px 20px rgba(0,0,0,0.03)",
                })}
              >
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        sx={(theme) => ({
                          fontSize: scaleFont(18, settings?.textSize),
                          fontWeight: item.isRead ? 700 : 800,
                          color: item.isRead
                            ? theme.palette.text.secondary
                            : theme.palette.text.primary,
                        })}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={(theme) => ({
                          mt: 1,
                          fontSize: scaleFont(15, settings?.textSize),
                          color: item.isRead
                            ? alpha(theme.palette.text.secondary, 0.8)
                            : theme.palette.text.secondary,
                        })}
                      >
                        {item.content}
                      </Typography>

                      <Typography
                        sx={(theme) => ({
                          mt: 1,
                          fontSize: scaleFont(13, settings?.textSize),
                          color: alpha(theme.palette.text.secondary, 0.75),
                        })}
                      >
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>

                    <Chip
                      label={item.typeName}
                      sx={(theme) => ({
                        borderRadius: 999,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha("#ffffff", 0.06)
                            : "#f2f4f7",
                        color: theme.palette.text.secondary,
                        fontSize: scaleFont(13, settings?.textSize),
                      })}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1.5}>
                    {!item.isRead && (
                      <Button
                        startIcon={<DoneRoundedIcon />}
                        onClick={() => markAsRead(item.id)}
                        sx={(theme) => ({
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: scaleFont(14, settings?.textSize),
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.success.main, 0.14)
                              : "#e7f8ec",
                          color: theme.palette.success.main,
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.success.main, 0.22)
                                : "#d8f2e0",
                          },
                        })}
                      >
                        {t("markAsRead")}
                      </Button>
                    )}

                    <Button
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => deleteNotification(item.id)}
                      sx={(theme) => ({
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: scaleFont(14, settings?.textSize),
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.error.main, 0.14)
                            : "#fde8e8",
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.error.main, 0.22)
                              : "#fbdede",
                        },
                      })}
                    >
                      {t("delete")}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};