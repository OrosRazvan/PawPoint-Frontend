import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { keyframes } from "@mui/system";
import { useSettings } from "../../hooks/useSettings";
import { getTextScale } from "../../utils/textSize";

import {
  contactMessageSchema,
  type ContactMessageFormValues,
} from "../../types/contactMessageSchema";
import { useCreateContactMessage } from "../../hooks/useCreateContactMessage";

/* ─── animations ─────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-3deg); }
  50%       { transform: translateY(-9px) rotate(-3deg); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.15); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/* ─── floating envelope ───────────────────────────────── */
const EnvelopeIllustration = ({ isDark }: { isDark: boolean }) => (
  <Box
    sx={{
      animation: `${float} 5s ease-in-out infinite`,
      flexShrink: 0,
      alignSelf: { xs: "center", sm: "auto" },
    }}
  >
    <svg
      width="150"
      height="150"
      viewBox="0 0 110 110"
      fill="none"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <ellipse
        cx="55"
        cy="102"
        rx="28"
        ry="5"
        fill={isDark ? "#000" : "#071c42"}
        fillOpacity="0.07"
      />
      <rect
        x="12"
        y="28"
        width="86"
        height="62"
        rx="10"
        fill={isDark ? alpha("#f97316", 0.08) : "#fff"}
        stroke={isDark ? alpha("#f97316", 0.35) : alpha("#f97316", 0.4)}
        strokeWidth="1.8"
      />
      <path
        d="M12 38l43 30 43-30"
        stroke={isDark ? alpha("#f97316", 0.4) : alpha("#f97316", 0.5)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="28"
        y="62"
        width="30"
        height="4"
        rx="2"
        fill={isDark ? alpha("#fff", 0.1) : alpha("#071c42", 0.08)}
      />
      <rect
        x="28"
        y="72"
        width="20"
        height="4"
        rx="2"
        fill={isDark ? alpha("#fff", 0.06) : alpha("#071c42", 0.05)}
      />
      <circle
        cx="82"
        cy="32"
        r="16"
        fill={isDark ? alpha("#f97316", 0.2) : "#fff7ed"}
        stroke={isDark ? alpha("#f97316", 0.45) : alpha("#f97316", 0.35)}
        strokeWidth="1.5"
      />
      <path
        d="M76 32l4 4 8-8"
        stroke="#f97316"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

/* ─── sidebar info items ──────────────────────────────── */
const InfoCard = ({
  isDark,
  t,
}: {
  isDark: boolean;
  t: (key: string) => string;
}) => {
  const items = [
    {
      icon: "⚡",
      label: t("contact:info.fastResponseTitle"),
      sub: t("contact:info.fastResponseSubtitle"),
    },
    {
      icon: "🔒",
      label: t("contact:info.securePrivateTitle"),
      sub: t("contact:info.securePrivateSubtitle"),
    },
    {
      icon: "💬",
      label: t("contact:info.fullThreadTitle"),
      sub: t("contact:info.fullThreadSubtitle"),
    },
  ];

  return (
    <Stack spacing={3}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "13px",
              flexShrink: 0,
              background: isDark
                ? alpha("#f97316", 0.1)
                : alpha("#f97316", 0.07),
              border: `1px solid ${
                isDark ? alpha("#f97316", 0.2) : alpha("#f97316", 0.12)
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            {item.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: isDark ? "#e2e8f0" : "#071c42",
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: isDark ? alpha("#fff", 0.35) : "#94a3b8",
                lineHeight: 1.5,
              }}
            >
              {item.sub}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
};

/* ─── main component ──────────────────────────────────── */
export const ContactUs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["contact", "messages"]);
  const createMutation = useCreateContactMessage();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: settings } = useSettings();
  const textZoom = getTextScale(settings?.textSize);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageFormValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = async (values: ContactMessageFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      enqueueSnackbar(t("messages:contactMessageSent"), { variant: "success" });
      reset();
    } catch {
      enqueueSnackbar(t("messages:contactMessageFailed"), { variant: "error" });
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "13px",
      backgroundColor: isDark ? alpha("#fff", 0.03) : "#f8fafc",
      transition: "box-shadow 0.2s ease, background-color 0.2s ease",
      "& fieldset": {
        borderColor: isDark ? alpha("#fff", 0.1) : "#cbd5e1",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: isDark
          ? alpha("#f97316", 0.4)
          : alpha("#f97316", 0.45),
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f97316",
        borderWidth: "2px",
      },
      "&.Mui-focused": {
        backgroundColor: isDark ? alpha("#fff", 0.04) : "#fff",
        boxShadow: `0 0 0 4px ${alpha("#f97316", isDark ? 0.1 : 0.08)}`,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ea580c" },
    "& .MuiInputBase-input": {
      color: isDark ? "#e2e8f0" : "#0f172a",
    },
  };

  return (
    <Box
      sx={{
        zoom: textZoom,
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "center",
        py: { xs: 4, sm: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        background: isDark
          ? "radial-gradient(ellipse at 75% 10%, #1c0f0233 0%, transparent 55%), #080d1a"
          : "radial-gradient(ellipse at 20% 0%, #fff7ed 0%, transparent 45%), radial-gradient(ellipse at 85% 95%, #fef3e2 0%, transparent 45%), #f8fafc",
      }}
    >
      <Box
        sx={{
          zoom: textZoom,
          width: "100%",
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(90px)",
          pointerEvents: "none",
          height: { xs: 260, sm: 320, md: 420 },
          top: { xs: -80, md: -120 },
          right: { xs: -90, md: -100 },
          backgroundColor: isDark
            ? alpha("#f97316", 0.05)
            : alpha("#f97316", 0.1),
        }}
      />
      <Box
        sx={{
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
          width: { xs: 200, sm: 220, md: 280 },
          height: { xs: 200, sm: 220, md: 280 },
          bottom: { xs: -50, md: -60 },
          left: { xs: -50, md: -60 },
          backgroundColor: isDark
            ? alpha("#3b82f6", 0.05)
            : alpha("#bfdbfe", 0.5),
        }}
      />

      <Stack
        spacing={{ xs: 3, md: 5 }}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 1200,
          animation: `${fadeUp} 0.5s ease both`,
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderRadius: { xs: "22px", md: "26px" },
            overflow: "hidden",
            position: "relative",
            background: isDark
              ? `linear-gradient(135deg, #1a1008 0%, #110b04 100%)`
              : `linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)`,
            border: `1px solid ${
              isDark ? alpha("#f97316", 0.18) : alpha("#f97316", 0.25)
            }`,
            boxShadow: isDark
              ? `0 2px 30px ${alpha("#000", 0.6)}`
              : `0 2px 20px ${alpha("#f97316", 0.1)}, 0 1px 3px ${alpha(
                  "#000",
                  0.04
                )}`,
          }}
        >
          <Box
            sx={{
              height: 3,
              background:
                "linear-gradient(90deg, #f97316 0%, #fb923c 55%, #fdba74 100%)",
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2.5, sm: 2 }}
            sx={{ px: { xs: 3, sm: 5, md: 7 }, py: { xs: 4, md: 6 } }}
          >
            <Box sx={{ width: "100%", minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: "'Syne', 'DM Sans', sans-serif",
                  fontSize: { xs: 30, sm: 36, md: 48 },
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.05,
                  color: isDark ? "#fde8d0" : "#071c42",
                  wordBreak: "break-word",
                }}
              >
                {t("contact:title")}
              </Typography>

              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2.5,
                  px: 2,
                  py: 0.7,
                  borderRadius: "999px",
                  background: isDark
                    ? alpha("#f97316", 0.12)
                    : "rgba(255,255,255,0.75)",
                  border: `1px solid ${
                    isDark ? alpha("#f97316", 0.25) : alpha("#f97316", 0.3)
                  }`,
                  backdropFilter: "blur(8px)",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#f97316",
                    animation: `${pulse} 2.5s ease-in-out infinite`,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: isDark ? "#fdba74" : "#c2410c",
                    letterSpacing: "0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {t("contact:sentToAdminNote")}
                </Typography>
              </Box>
            </Box>

            <EnvelopeIllustration isDark={isDark} />
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          alignItems="stretch"
          sx={{ width: "100%" }}
        >
          <Card
            sx={{
              flex: 1,
              minWidth: 0,
              borderRadius: { xs: "18px", md: "22px" },
              border: `1px solid ${isDark ? alpha("#fff", 0.07) : "#e2e8f0"}`,
              boxShadow: isDark
                ? `0 8px 40px ${alpha("#000", 0.55)}`
                : `0 4px 24px ${alpha("#071c42", 0.06)}, 0 1px 3px ${alpha(
                    "#000",
                    0.03
                  )}`,
              background: isDark ? "#0d1627" : "#fff",
              overflow: "hidden",
              animation: `${fadeUp} 0.5s 0.1s ease both`,
            }}
          >
            <Box
              sx={{
                height: 3,
                background: "linear-gradient(90deg, #f97316, #fb923c 70%)",
              }}
            />
            <CardContent
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                "&:last-child": { pb: { xs: 3, sm: 4, md: 5 } },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 4 }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    flexShrink: 0,
                    background: isDark ? alpha("#f97316", 0.12) : "#fff7ed",
                    border: `1px solid ${
                      isDark ? alpha("#f97316", 0.22) : alpha("#f97316", 0.18)
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      stroke={isDark ? "#fb923c" : "#ea580c"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      color: isDark ? "#e2e8f0" : "#071c42",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {t("contact:newMessage")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      color: isDark ? alpha("#fff", 0.3) : "#94a3b8",
                    }}
                  >
                    {t("contact:fillDetails")}
                  </Typography>
                </Box>
              </Stack>

              <Stack
                component="form"
                spacing={3}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("contact:messageTitle")}
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={fieldSx}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("contact:description")}
                      multiline
                      minRows={8}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      sx={fieldSx}
                    />
                  )}
                />

                {createMutation.isError && (
                  <Alert
                    severity="error"
                    sx={{ borderRadius: "12px", fontWeight: 600 }}
                  >
                    {t("messages:contactMessageFailed")}
                  </Alert>
                )}

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    pt: 1.5,
                    borderTop: `1px solid ${
                      isDark ? alpha("#fff", 0.07) : "#f1f5f9"
                    }`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        animation: `${pulse} 3s ease-in-out infinite`,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.77rem",
                        color: isDark ? alpha("#fff", 0.28) : "#94a3b8",
                        lineHeight: 1.4,
                      }}
                    >
                      {t("contact:responseTime")}
                    </Typography>
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || createMutation.isPending}
                    disableElevation
                    sx={{
                      borderRadius: "13px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",
                      px: 4.5,
                      py: 1.5,
                      letterSpacing: "0.01em",
                      background:
                        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      boxShadow: `0 4px 16px ${alpha("#f97316", 0.38)}`,
                      color: "#fff",
                      transition: "all 0.22s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
                        boxShadow: `0 6px 24px ${alpha("#f97316", 0.52)}`,
                        transform: "translateY(-1px) scale(1.02)",
                      },
                      "&:active": { transform: "scale(0.98)" },
                      "&.Mui-disabled": {
                        background: isDark
                          ? alpha("#fff", 0.08)
                          : alpha("#000", 0.06),
                        color: isDark
                          ? alpha("#fff", 0.25)
                          : alpha("#000", 0.25),
                        boxShadow: "none",
                      },
                      alignSelf: { xs: "stretch", sm: "auto" },
                      width: { xs: "100%", sm: "auto" },
                      minWidth: { xs: "100%", sm: 148 },
                    }}
                  >
                    {isSubmitting || createMutation.isPending ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            border: "2px solid rgba(255,255,255,0.35)",
                            borderTopColor: "#fff",
                            animation: `${spin} 0.7s linear infinite`,
                          }}
                        />
                        <span>{t("contact:sending")}</span>
                      </Stack>
                    ) : (
                      t("contact:send")
                    )}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              width: { xs: "100%", md: 300 },
              flexShrink: 0,
              animation: `${fadeUp} 0.5s 0.18s ease both`,
            }}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: "20px",
                border: `1px solid ${isDark ? alpha("#fff", 0.07) : "#e2e8f0"}`,
                boxShadow: isDark
                  ? `0 4px 24px ${alpha("#000", 0.45)}`
                  : `0 2px 12px ${alpha("#071c42", 0.04)}`,
                background: isDark ? "#0d1627" : "#fff",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: 3,
                  background: "linear-gradient(90deg, #f97316, #fdba74)",
                }}
              />
              <CardContent
                sx={{ p: 3.5, "&:last-child": { pb: 3.5 } }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isDark ? alpha("#fff", 0.28) : "#94a3b8",
                    mb: 2,
                  }}
                >
                  {t("contact:whatToExpect")}
                </Typography>
                <InfoCard isDark={isDark} t={t} />
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};