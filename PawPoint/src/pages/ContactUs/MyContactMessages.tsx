import {
  Alert,
  Box,
  Collapse,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyContactMessages } from "../../hooks/useMyContactMessages";
import { keyframes } from "@mui/system";
import { useSettings } from "../../hooks/useSettings";
import { getTextScale } from "../../utils/textSize";

/* ─── animations ─────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.2); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/* ─── status chip ─────────────────────────────────────── */
const StatusBadge = ({
  label,
  isDark,
  t,
}: {
  label: string;
  isDark: boolean;
  t: (key: string) => string;
}) => {
  const map: Record<
    string,
    { bg: string; text: string; border: string; dot: string; translated: string }
  > = {
    Open: {
      bg: isDark ? alpha("#22c55e", 0.15) : alpha("#22c55e", 0.1),
      text: isDark ? "#86efac" : "#15803d",
      border: isDark ? alpha("#22c55e", 0.3) : alpha("#22c55e", 0.25),
      dot: "#22c55e",
      translated: t("status.open"),
    },
    Closed: {
      bg: isDark ? alpha("#94a3b8", 0.12) : alpha("#94a3b8", 0.1),
      text: isDark ? "#94a3b8" : "#64748b",
      border: isDark ? alpha("#94a3b8", 0.2) : alpha("#94a3b8", 0.18),
      dot: "#94a3b8",
      translated: t("status.closed"),
    },
    Pending: {
      bg: isDark ? alpha("#f59e0b", 0.15) : alpha("#f59e0b", 0.1),
      text: isDark ? "#fcd34d" : "#b45309",
      border: isDark ? alpha("#f59e0b", 0.3) : alpha("#f59e0b", 0.25),
      dot: "#f59e0b",
      translated: t("status.pending"),
    },
  };

  const s = map[label] ?? {
    bg: alpha("#f97316", 0.1),
    text: "#ea580c",
    border: alpha("#f97316", 0.2),
    dot: "#f97316",
    translated: label,
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.8,
        px: 1.5,
        py: 0.35,
        borderRadius: "999px",
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: s.dot,
          animation: label === "Open" ? `${pulse} 2.5s ease-in-out infinite` : "none",
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: s.text,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {s.translated}
      </Typography>
    </Box>
  );
};

/* ─── reply bubble ────────────────────────────────────── */
const ReplyBubble = ({
  reply,
  isDark,
  isAdmin,
  t,
}: {
  reply: {
    id: number;
    senderName: string;
    senderType: string;
    message: string;
    createdAt: string;
  };
  isDark: boolean;
  isAdmin: boolean;
  t: (key: string) => string;
}) => (
  <Stack
    key={reply.id}
    direction={isAdmin ? "row" : "row-reverse"}
    spacing={{ xs: 1, sm: 1.5 }}
    alignItems="flex-start"
    sx={{ animation: `${fadeUp} 0.3s ease both` }}
  >
    <Box
      sx={{
        width: { xs: 30, sm: 34 },
        height: { xs: 30, sm: 34 },
        borderRadius: "10px",
        flexShrink: 0,
        background: isAdmin
          ? isDark
            ? alpha("#f97316", 0.18)
            : "#fff7ed"
          : isDark
          ? alpha("#3b82f6", 0.18)
          : "#eff6ff",
        border: `1px solid ${
          isAdmin
            ? isDark
              ? alpha("#f97316", 0.3)
              : alpha("#f97316", 0.2)
            : isDark
            ? alpha("#3b82f6", 0.3)
            : alpha("#3b82f6", 0.2)
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: { xs: "0.72rem", sm: "0.8rem" },
        fontWeight: 800,
        color: isAdmin
          ? isDark
            ? "#fb923c"
            : "#ea580c"
          : isDark
          ? "#60a5fa"
          : "#2563eb",
      }}
    >
      {reply.senderName.charAt(0).toUpperCase()}
    </Box>

    <Box sx={{ maxWidth: { xs: "calc(100% - 42px)", sm: "80%" }, minWidth: 0 }}>
      <Stack
        direction={isAdmin ? "row" : "row-reverse"}
        spacing={1}
        alignItems="center"
        sx={{ mb: 0.6, flexWrap: "wrap", rowGap: 0.6 }}
      >
        <Typography
          sx={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: isDark ? "#e2e8f0" : "#071c42",
            wordBreak: "break-word",
          }}
        >
          {reply.senderName}
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.15,
            borderRadius: "999px",
            backgroundColor: isAdmin
              ? isDark
                ? alpha("#f97316", 0.12)
                : alpha("#f97316", 0.08)
              : isDark
              ? alpha("#3b82f6", 0.12)
              : alpha("#3b82f6", 0.08),
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: isAdmin
                ? isDark
                  ? "#fdba74"
                  : "#c2410c"
                : isDark
                ? "#93c5fd"
                : "#1d4ed8",
              lineHeight: 1.2,
            }}
          >
            {isAdmin ? t("admin") : t("user")}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.2, sm: 1.5 },
          borderRadius: isAdmin ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          background: isAdmin
            ? isDark
              ? alpha("#f97316", 0.08)
              : alpha("#f97316", 0.06)
            : isDark
            ? alpha("#3b82f6", 0.1)
            : alpha("#3b82f6", 0.07),
          border: `1px solid ${
            isAdmin
              ? isDark
                ? alpha("#f97316", 0.15)
                : alpha("#f97316", 0.12)
              : isDark
              ? alpha("#3b82f6", 0.15)
              : alpha("#3b82f6", 0.1)
          }`,
        }}
      >
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            fontSize: { xs: "0.82rem", sm: "0.87rem" },
            color: isDark ? "#cbd5e1" : "#334155",
            lineHeight: 1.65,
            wordBreak: "break-word",
          }}
        >
          {reply.message}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: "0.7rem",
          color: isDark ? alpha("#fff", 0.25) : "#94a3b8",
          mt: 0.5,
          textAlign: isAdmin ? "left" : "right",
          wordBreak: "break-word",
        }}
      >
        {new Date(reply.createdAt).toLocaleString()}
      </Typography>
    </Box>
  </Stack>
);

/* ─── accordion message card ──────────────────────────── */
const MessageCard = ({
  message,
  isDark,
  index,
}: {
  message: any;
  isDark: boolean;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("contact");

  return (
    <Box
      sx={{
        borderRadius: { xs: "16px", sm: "20px" },
        overflow: "hidden",
        border: `1px solid ${
          isDark ? alpha("#fff", 0.08) : alpha("#e2e8f0", 1)
        }`,
        boxShadow: isDark
          ? `0 2px 16px ${alpha("#000", 0.4)}`
          : `0 2px 12px ${alpha("#071c42", 0.05)}`,
        background: isDark ? "#0d1627" : "#fff",
        animation: `${fadeUp} 0.4s ${0.06 * index}s ease both`,
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        "&:hover": {
          boxShadow: isDark
            ? `0 4px 28px ${alpha("#000", 0.55)}`
            : `0 4px 22px ${alpha("#071c42", 0.1)}`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          height: 2.5,
          background:
            message.status === "Open"
              ? "linear-gradient(90deg, #22c55e, #86efac)"
              : message.status === "Pending"
              ? "linear-gradient(90deg, #f59e0b, #fcd34d)"
              : `linear-gradient(90deg, ${alpha("#94a3b8", 0.5)}, ${alpha(
                  "#cbd5e1",
                  0.5
                )})`,
        }}
      />

      <Box
        onClick={() => setOpen(!open)}
        sx={{
          px: { xs: 2, sm: 2.5, md: 3 },
          py: { xs: 2, sm: 2.5 },
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.18s ease",
          "&:hover": {
            background: isDark ? alpha("#fff", 0.02) : alpha("#f97316", 0.015),
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={{ xs: 1.5, sm: 2 }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1.25, sm: 2 }}
            alignItems="center"
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: "12px",
                flexShrink: 0,
                background: isDark ? alpha("#f97316", 0.1) : "#fff7ed",
                border: `1px solid ${
                  isDark ? alpha("#f97316", 0.2) : alpha("#f97316", 0.15)
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 800,
                color: isDark ? "#fb923c" : "#ea580c",
              }}
            >
              #{message.id}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.9rem", sm: "0.97rem" },
                  color: isDark ? "#e2e8f0" : "#071c42",
                  letterSpacing: "-0.1px",
                }}
              >
                {message.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: isDark ? alpha("#fff", 0.35) : "#94a3b8",
                  mt: 0.25,
                  wordBreak: "break-word",
                }}
              >
                {message.email}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            alignItems="center"
            justifyContent={{ xs: "space-between", sm: "flex-end" }}
            sx={{ flexShrink: 0, flexWrap: "wrap", rowGap: 0.75 }}
          >
            <StatusBadge label={message.status} isDark={isDark} t={t} />

            {message.replies.length > 0 && (
              <Box
                sx={{
                  px: 1.3,
                  py: 0.3,
                  borderRadius: "999px",
                  backgroundColor: isDark
                    ? alpha("#fff", 0.07)
                    : alpha("#071c42", 0.05),
                  border: `1px solid ${
                    isDark ? alpha("#fff", 0.1) : alpha("#071c42", 0.08)
                  }`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: isDark ? alpha("#fff", 0.45) : "#64748b",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("repliesCount", { count: message.replies.length })}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                flexShrink: 0,
                background: isDark ? alpha("#fff", 0.06) : alpha("#071c42", 0.04),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.25s ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke={isDark ? alpha("#fff", 0.5) : "#94a3b8"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Collapse in={open} timeout={280}>
        <Box
          sx={{
            mx: { xs: 1.5, sm: 2, md: 2.5 },
            mb: { xs: 2, sm: 2.5 },
            borderRadius: "16px",
            border: `1px solid ${isDark ? alpha("#fff", 0.07) : "#f1f5f9"}`,
            background: isDark ? alpha("#fff", 0.02) : "#f8fafc",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.5, pb: 2 }}>
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: { xs: "0.84rem", sm: "0.88rem" },
                color: isDark ? "#cbd5e1" : "#334155",
                lineHeight: 1.7,
                wordBreak: "break-word",
              }}
            >
              {message.description}
            </Typography>
          </Box>

          <Box
            sx={{
              height: "1px",
              background: isDark ? alpha("#fff", 0.06) : "#e2e8f0",
              mx: { xs: 2, sm: 2.5 },
            }}
          />

          <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  color: isDark ? "#e2e8f0" : "#071c42",
                  letterSpacing: "-0.1px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("replies")}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  background: isDark ? alpha("#fff", 0.07) : "#e2e8f0",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: isDark ? alpha("#fff", 0.25) : "#94a3b8",
                  whiteSpace: "nowrap",
                }}
              >
                {t("totalCount", { count: message.replies.length })}
              </Typography>
            </Stack>

            {message.replies.length === 0 ? (
              <Box
                sx={{
                  py: 3,
                  px: 2,
                  borderRadius: "12px",
                  background: isDark ? alpha("#fff", 0.03) : alpha("#f97316", 0.03),
                  border: `1px dashed ${
                    isDark ? alpha("#fff", 0.1) : alpha("#f97316", 0.15)
                  }`,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "1.4rem", mb: 0.5 }}>📭</Typography>
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    color: isDark ? alpha("#fff", 0.3) : "#94a3b8",
                    lineHeight: 1.5,
                  }}
                >
                  {t("noReplies")}
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {message.replies.map((reply: any) => (
                  <ReplyBubble
                    key={reply.id}
                    reply={reply}
                    isDark={isDark}
                    isAdmin={reply.senderType?.toLowerCase() === "admin"}
                    t={t}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

/* ─── main ───────────────────────────────────────────── */
export const MyContactMessages = () => {
  const { t } = useTranslation("contact");
  const messagesQuery = useMyContactMessages();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: settings } = useSettings();
  const textZoom = getTextScale(settings?.textSize);

  if (messagesQuery.isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "40vh", zoom: textZoom, width: "100%" }}
      >
        <Box
          sx={{
            width: 20,
            height: 36,
            borderRadius: "50%",
            border: `3px solid ${
              isDark ? alpha("#f97316", 0.2) : alpha("#f97316", 0.15)
            }`,
            borderTopColor: "#f97316",
            animation: `${spin} 0.8s linear infinite`,
          }}
        />
      </Stack>
    );
  }

  if (messagesQuery.isError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600 }}>
        {t("loadFailed")}
      </Alert>
    );
  }

  const messages = messagesQuery.data ?? [];
  const openCount = messages.filter((m: any) => m.status === "Open").length;

  return (
    <Stack
      spacing={{ xs: 3, md: 4 }}
      sx={{
        animation: `${fadeUp} 0.4s ease both`,
        pt: { xs: 2, md: 3 },
        px: { xs: 0, sm: 1, md: 2 },
        maxWidth: 1260,
        mx: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          borderRadius: { xs: "18px", sm: "20px", md: "24px" },
          px: { xs: 2.5, sm: 3, md: 5 },
          py: { xs: 2.5, sm: 3, md: 4 },
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, #1a1008 0%, #110b04 100%)"
            : "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          border: `1px solid ${
            isDark ? alpha("#f97316", 0.18) : alpha("#f97316", 0.22)
          }`,
          boxShadow: isDark
            ? `0 2px 24px ${alpha("#000", 0.5)}`
            : `0 2px 16px ${alpha("#f97316", 0.1)}`,
        }}
      >
        <Box
          sx={{
            height: 3,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(90deg, #f97316, #fb923c 55%, #fdba74)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: { xs: 140, sm: 180, md: 200 },
            height: { xs: 140, sm: 180, md: 200 },
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
            backgroundColor: alpha("#f97316", isDark ? 0.08 : 0.12),
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          spacing={{ xs: 2, sm: 2 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Syne', 'DM Sans', sans-serif",
                fontSize: { xs: 24, sm: 28, md: 34 },
                fontWeight: 800,
                letterSpacing: "-0.6px",
                lineHeight: 1.1,
                color: isDark ? "#fde8d0" : "#071c42",
                wordBreak: "break-word",
              }}
            >
              {t("myMessages")}
            </Typography>
            <Typography
              sx={{
                mt: 0.8,
                color: isDark ? alpha("#fde8d0", 0.5) : "#64748b",
                fontSize: { xs: "0.84rem", sm: "0.9rem" },
                lineHeight: 1.5,
              }}
            >
              {t("myMessagesSubtitle")}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          >
            {[
              { label: t("stats.total"), value: messages.length },
              { label: t("stats.open"), value: openCount },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{ textAlign: { xs: "left", sm: "right" }, minWidth: 0 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 20, sm: 24, md: 28 },
                    fontWeight: 800,
                    lineHeight: 1,
                    color: isDark ? "#fde8d0" : "#071c42",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isDark ? alpha("#fde8d0", 0.4) : "#94a3b8",
                    mt: 0.3,
                    lineHeight: 1.2,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {messages.length === 0 ? (
        <Box
          sx={{
            py: { xs: 5, md: 6 },
            px: 2,
            borderRadius: { xs: "16px", sm: "20px" },
            textAlign: "center",
            border: `1.5px dashed ${
              isDark ? alpha("#f97316", 0.2) : alpha("#f97316", 0.18)
            }`,
            background: isDark
              ? alpha("#f97316", 0.03)
              : alpha("#f97316", 0.025),
          }}
        >
          <Typography sx={{ fontSize: "2rem", mb: 1 }}>📬</Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: isDark ? "#e2e8f0" : "#071c42",
              fontSize: "0.95rem",
            }}
          >
            {t("emptyTitle")}
          </Typography>
          <Typography
            sx={{
              color: isDark ? alpha("#fff", 0.3) : "#94a3b8",
              fontSize: "0.82rem",
              mt: 0.5,
              lineHeight: 1.5,
            }}
          >
            {t("emptySubtitle")}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {messages.map((message: any, i: number) => (
            <MessageCard
              key={message.id}
              message={message}
              isDark={isDark}
              index={i}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};