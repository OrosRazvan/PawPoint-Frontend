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
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import { useDeleteNotification } from "../../hooks/useDeleteNotification";
import { useNotificationRealtime } from "../../hooks/useNotificationRealtime";

const pageBg = "#f8f4ef";

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
  const { t } = useTranslation(["notifications"]);
  useNotificationRealtime();

  const { data, isLoading, isError } = useNotifications({
    pageNumber: 1,
    pageSize: 20,
  });

  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = data?.items ?? [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: pageBg,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={4}>
        <Typography
          sx={{
            fontSize: { xs: 34, md: 42 },
            fontWeight: 800,
            color: "#0b1f44",
          }}
        >
          {t("notifications:title")}
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("notifications:loadError")}</Typography>
        ) : notifications.length === 0 ? (
          <Typography sx={{ color: "#667085" }}>
            {t("notifications:empty")}
          </Typography>
        ) : (
          <Stack spacing={2.2}>
            {notifications.map((item: typeof notifications[number]) => (
              <Box
                key={item.id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #ebe3da",
                  backgroundColor: item.isRead ? "#f5f5f5" : "#fffdfb",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
                }}
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
                        sx={{
                          fontSize: 18,
                          fontWeight: item.isRead ? 700 : 800,
                          color: item.isRead ? "#667085" : "#071c42",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 15,
                          color: item.isRead ? "#98a2b3" : "#475467",
                        }}
                      >
                        {item.content}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 13,
                          color: "#98a2b3",
                        }}
                      >
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>

                    <Chip
                      label={item.typeName}
                      sx={{
                        borderRadius: 999,
                        backgroundColor: "#f2f4f7",
                        color: "#475467",
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1.5}>
                    {!item.isRead && (
                      <Button
                        startIcon={<DoneRoundedIcon />}
                        onClick={() => markAsRead(item.id)}
                        sx={{
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 700,
                          backgroundColor: "#e7f8ec",
                          color: "#067647",
                        }}
                      >
                        {t("notifications:markAsRead")}
                      </Button>
                    )}

                    <Button
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => deleteNotification(item.id)}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        backgroundColor: "#fde8e8",
                        color: "#d92d20",
                      }}
                    >
                      {t("notifications:delete")}
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