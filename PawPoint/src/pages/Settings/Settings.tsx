import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { alpha, type Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSettings } from "../../hooks/useSettings";
import { useUpdateSettings } from "../../hooks/useUpdateSettings";
import { scaleFont } from "../../utils/fontScale";
import type {
  UpdateUserSettingsDto,
  UserSettingsDto,
} from "./types/settings";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#f7ae1a";
const ACCENT_DIM = "rgba(247,174,26,0.12)";
const ACCENT_GLOW = "rgba(247,174,26,0.22)";

// ─── Static sx objects (outside component — no re-creation on render) ─────────
const orangeSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#f7ae1a",
    opacity: 1,
  },
  "& .MuiSwitch-track": { opacity: 1 },
} as const;

const cardSx = (theme: Theme) => ({
  position: "relative" as const,
  borderRadius: "24px",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 100%)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.06)"
  }`,
  px: { xs: 2.5, sm: 3, md: 3.5 },
  py: { xs: 3, md: 3.5 },
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 64px rgba(0,0,0,0.45)"
      : "0 1px 0 rgba(255,255,255,0.9) inset, 0 24px 64px rgba(0,0,0,0.07)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
    opacity: 0.7,
  },
});

const iconPillSx = {
  width: 44,
  height: 44,
  borderRadius: "14px",
  backgroundColor: ACCENT_DIM,
  border: `1px solid ${ACCENT_GLOW}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
} as const;

const rowSx = (theme: Theme) => ({
  display: "flex",
  flexDirection: "row" as const,
  justifyContent: "space-between",
  alignItems: "center",
  px: 2.5,
  py: 2.5,
  borderRadius: "16px",
  transition: "background 0.15s",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)",
  },
});

const subRowSx = (theme: Theme) => ({
  display: "flex",
  flexDirection: "row" as const,
  justifyContent: "space-between",
  alignItems: "center",
  px: 2.5,
  py: 2,
  borderRadius: "12px",
  transition: "background 0.15s",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)",
  },
});

const dividerSx = (theme: Theme) => ({
  borderColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.06)",
});

// ─── Component ────────────────────────────────────────────────────────────────
export const Settings = () => {
  const { t } = useTranslation(["settings"]);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [form, setForm] = useState<UserSettingsDto | null>(null);

  useEffect(() => {
    if (!data) return;

    const textSize =
      data.textSize === "Small" || data.textSize === "Medium" || data.textSize === "Large"
        ? data.textSize
        : "Medium";

    const weightUnit =
      data.weightUnit === "kg" || data.weightUnit === "lb"
        ? data.weightUnit
        : "kg";

    const dateFormat =
      data.dateFormat === "DD/MM/YYYY" ||
      data.dateFormat === "MM/DD/YYYY" ||
      data.dateFormat === "YYYY-MM-DD"
        ? data.dateFormat
        : "DD/MM/YYYY";

    const currency =
      data.currency === "RON" || data.currency === "EUR"
        ? data.currency
        : "EUR";

    const notificationBadgeMode =
      data.notificationBadgeMode === "dot" || data.notificationBadgeMode === "count"
        ? data.notificationBadgeMode
        : "count";

    setForm({
      ...data,
      textSize,
      weightUnit,
      dateFormat,
      currency,
      notificationBadgeMode,
    });
  }, [data]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading || !form) {
    return (
      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <CircularProgress sx={{ color: ACCENT }} />
      </Box>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        })}
      >
        <Typography color="error">{t("settings:saveError")}</Typography>
      </Box>
    );
  }

  // ── Dynamic sx helpers (depend on form.textSize so defined inside) ────────
  const optionButtonSx = (active: boolean) => (theme: Theme) => ({
    flex: 1,
    py: 1.8,
    borderRadius: "14px",
    textTransform: "none" as const,
    fontSize: scaleFont(15, form.textSize),
    fontWeight: 700,
    letterSpacing: "0.02em",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: active ? `1.5px solid ${ACCENT}` : "1.5px solid transparent",
    background: active
      ? `linear-gradient(135deg, ${ACCENT} 0%, #e09a10 100%)`
      : theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.03)",
    color: active ? "#1a1200" : theme.palette.text.secondary,
    boxShadow: active ? `0 4px 20px ${ACCENT_GLOW}` : "none",
    "&:hover": {
      background: active
        ? `linear-gradient(135deg, #ffc02d 0%, ${ACCENT} 100%)`
        : theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.06)",
      transform: "translateY(-1px)",
      boxShadow: active ? `0 6px 24px ${ACCENT_GLOW}` : "none",
    },
  });

  // ── Handlers (logic unchanged) ────────────────────────────────────────────
  const updateField = <K extends keyof UserSettingsDto>(
    key: K,
    value: UserSettingsDto[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleToggleNotifications = (checked: boolean) => {
    if (!form) return;
    if (!checked) {
      setForm({
        ...form,
        enableNotifications: false,
        vaccinationNotifications: false,
        appointmentNotifications: false,
        dewormingNotifications: false,
      });
      return;
    }
    setForm({
      ...form,
      enableNotifications: true,
      vaccinationNotifications: true,
      appointmentNotifications: true,
      dewormingNotifications: true,
    });
  };

  const handleSave = () => {
    if (!form) return;
    const payload: UpdateUserSettingsDto = {
      darkMode: form.darkMode,
      textSize:
        form.textSize === "Small" || form.textSize === "Medium" || form.textSize === "Large"
          ? form.textSize
          : "Medium",
      weightUnit:
        form.weightUnit === "kg" || form.weightUnit === "lb"
          ? form.weightUnit
          : "kg",
      dateFormat:
        form.dateFormat === "DD/MM/YYYY" ||
        form.dateFormat === "MM/DD/YYYY" ||
        form.dateFormat === "YYYY-MM-DD"
          ? form.dateFormat
          : "DD/MM/YYYY",
      currency:
        form.currency === "RON" || form.currency === "EUR"
          ? form.currency
          : "EUR",
      enableNotifications: form.enableNotifications,
      vaccinationNotifications: form.vaccinationNotifications,
      appointmentNotifications: form.appointmentNotifications,
      dewormingNotifications: form.dewormingNotifications,
      notificationBadgeMode:
        form.notificationBadgeMode === "dot" || form.notificationBadgeMode === "count"
          ? form.notificationBadgeMode
          : "count",
    };
    updateSettingsMutation.mutate(payload, {
      onSuccess: (updated) => {
        setForm({
          ...updated,
          currency: form.currency ?? "EUR",
        });

        enqueueSnackbar(t("settings:saved"), { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar(t("settings:saveError"), { variant: "error" });
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(247,174,26,0.08) 0%, transparent 70%),
               linear-gradient(180deg, #0f0e0c 0%, #111010 100%)`
            : `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(247,174,26,0.06) 0%, transparent 70%),
               #f5f3ef`,
        px: { xs: 2, sm: 3, md: 4, lg: 5 },
        py: { xs: 2.5, md: 3.5, lg: 4 },
      })}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Stack spacing={3}>

          {/* ── Page title ────────────────────────────────────────────────── */}
          <Box>
            <Typography
              sx={(theme) => ({
                fontSize: {
                  xs: scaleFont(32, form.textSize),
                  md: scaleFont(44, form.textSize),
                },
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: theme.palette.text.primary,
                lineHeight: 1,
              })}
            >
              {t("settings:title")}
            </Typography>
            <Box
              sx={{
                mt: 1.5,
                height: "3px",
                width: 56,
                borderRadius: "2px",
                background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
              }}
            />
          </Box>

          {/* ── Two-column grid on lg+, single column on smaller ─────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 2.5, md: 3 },
              alignItems: "start",
            }}
          >

            {/* ════════════════════════════════════════════════════════════
                APPEARANCE CARD
            ════════════════════════════════════════════════════════════ */}
            <Box sx={cardSx}>
              <Stack spacing={1.5}>

                {/* Header */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={iconPillSx}>
                    <PaletteOutlinedIcon sx={{ fontSize: 22, color: ACCENT }} />
                  </Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(22, form.textSize),
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: theme.palette.text.primary,
                    })}
                  >
                    {t("settings:appearance")}
                  </Typography>
                </Stack>

                <Divider sx={dividerSx} />

                {/* Language */}
                <Box sx={rowSx}>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    })}
                  >
                    {t("settings:changeLanguage")}
                  </Typography>
                  <LanguageSwitcher />
                </Box>

                <Divider sx={dividerSx} />

                <Box sx={rowSx}>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    })}
                  >
                    {t("settings:currency")}
                  </Typography>

                  <FormControl sx={{ minWidth: 150 }}>
                    <Select
                      value={form.currency ?? "EUR"}
                      onChange={(e) =>
                        updateField(
                          "currency",
                          e.target.value as UserSettingsDto["currency"]
                        )
                      }
                      renderValue={(value) =>
                        value === "RON" ? "💵 RON" : "💶 EUR"
                      }
                      sx={(theme) => ({
                        height: 48,
                        borderRadius: 999,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "#ffffff",
                        fontSize: scaleFont(15, form.textSize),
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        px: 1,
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "none"
                            : "0 8px 24px rgba(0,0,0,0.06)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.10)"
                              : "rgba(0,0,0,0.10)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: ACCENT,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: ACCENT,
                          borderWidth: 1.5,
                        },
                      })}
                    >
                      <MenuItem value="EUR">💶 EUR</MenuItem>
                      <MenuItem value="RON">💵 RON</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={dividerSx} />

                {/* Dark mode */}
                <Box sx={rowSx}>
                  <Box>
                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(16, form.textSize),
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                      })}
                    >
                      {t("settings:theme")}
                    </Typography>
                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(13, form.textSize),
                        color: theme.palette.text.secondary,
                        mt: 0.4,
                      })}
                    >
                      {t("settings:themeSubtitle")}
                    </Typography>
                  </Box>
                  <Switch
                    checked={form.darkMode}
                    onChange={(e) => updateField("darkMode", e.target.checked)}
                    sx={orangeSwitchSx}
                  />
                </Box>

                <Divider sx={dividerSx} />

                {/* Text size */}
                <Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                    })}
                  >
                    {t("settings:textSize")}
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    {(
                      [
                        ["Small", "small"],
                        ["Medium", "medium"],
                        ["Large", "large"],
                      ] as const
                    ).map(([val, key]) => (
                      <Button
                        key={val}
                        onClick={() => updateField("textSize", val)}
                        sx={optionButtonSx(form.textSize === val)}
                      >
                        {t(`settings:${key}`)}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={dividerSx} />

                {/* Weight unit */}
                <Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                    })}
                  >
                    {t("settings:weightUnits")}
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    {(["kg", "lb"] as const).map((unit) => (
                      <Button
                        key={unit}
                        onClick={() => updateField("weightUnit", unit)}
                        sx={optionButtonSx(form.weightUnit === unit)}
                      >
                        {unit.toUpperCase()}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={dividerSx} />

                {/* Date format */}
                <Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                    })}
                  >
                    {t("settings:dateFormat")}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={form.dateFormat || "DD/MM/YYYY"}
                      onChange={(e) =>
                        updateField(
                          "dateFormat",
                          e.target.value as UserSettingsDto["dateFormat"]
                        )
                      }
                      sx={(theme) => ({
                        borderRadius: "14px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.03)",
                        fontSize: scaleFont(14, form.textSize),
                        color: theme.palette.text.primary,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.10)"
                              : "rgba(0,0,0,0.10)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: ACCENT,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: ACCENT,
                          borderWidth: 1.5,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.text.secondary,
                        },
                      })}
                    >
                      {(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] as const).map(
                        (fmt) => (
                          <MenuItem
                            key={fmt}
                            value={fmt}
                            sx={{ fontSize: scaleFont(14, form.textSize) }}
                          >
                            {fmt}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* ════════════════════════════════════════════════════════════
                NOTIFICATIONS CARD
            ════════════════════════════════════════════════════════════ */}
            <Box sx={cardSx}>
              <Stack spacing={1.5}>

                {/* Header */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={iconPillSx}>
                    <NotificationsNoneRoundedIcon
                      sx={{ fontSize: 22, color: ACCENT }}
                    />
                  </Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(22, form.textSize),
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: theme.palette.text.primary,
                    })}
                  >
                    {t("settings:notifications")}
                  </Typography>
                </Stack>

                <Divider sx={dividerSx} />

                {/* Master toggle */}
                <Box sx={rowSx}>
                  <Box>
                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(16, form.textSize),
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                      })}
                    >
                      {t("settings:enableNotifications")}
                    </Typography>
                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(13, form.textSize),
                        color: theme.palette.text.secondary,
                        mt: 0.4,
                      })}
                    >
                      {t("settings:enableNotificationsSubtitle")}
                    </Typography>
                  </Box>
                  <Switch
                    checked={form.enableNotifications}
                    onChange={(e) =>
                      handleToggleNotifications(e.target.checked)
                    }
                    sx={orangeSwitchSx}
                  />
                </Box>

                <Divider sx={dividerSx} />

                {/* Reminder sub-toggles */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: scaleFont(12, form.textSize),
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      mb: 1.5,
                    }}
                  >
                    {t("settings:reminderSettings")}
                  </Typography>

                  <Box
                    sx={(theme) => ({
                      borderRadius: "18px",
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)",
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.05)"
                      }`,
                      overflow: "hidden",
                    })}
                  >
                    {(
                      [
                        {
                          label: t("settings:vaccinations"),
                          field: "vaccinationNotifications" as const,
                        },
                        {
                          label: t("settings:appointments"),
                          field: "appointmentNotifications" as const,
                        },
                        {
                          label: t("settings:deworming"),
                          field: "dewormingNotifications" as const,
                        },
                      ] as const
                    ).map(({ label, field }, i, arr) => (
                      <Box key={field}>
                        <Box sx={subRowSx}>
                          <Typography
                            sx={(theme) => ({
                              fontSize: scaleFont(15, form.textSize),
                              fontWeight: 600,
                              color: form.enableNotifications
                                ? theme.palette.text.primary
                                : theme.palette.text.disabled,
                              transition: "color 0.2s",
                            })}
                          >
                            {label}
                          </Typography>
                          <Switch
                            checked={form[field]}
                            disabled={!form.enableNotifications}
                            onChange={(e) =>
                              updateField(field, e.target.checked)
                            }
                            sx={orangeSwitchSx}
                          />
                        </Box>
                        {i < arr.length - 1 && (
                          <Divider
                            sx={(theme) => ({
                              mx: 2.5,
                              borderColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.04)"
                                  : "rgba(0,0,0,0.04)",
                            })}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider sx={dividerSx} />

                {/* Badge mode */}
                <Box>
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(16, form.textSize),
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 2,
                    })}
                  >
                    {t("settings:badgeMode")}
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      onClick={() =>
                        updateField("notificationBadgeMode", "count")
                      }
                      sx={optionButtonSx(
                        form.notificationBadgeMode === "count"
                      )}
                    >
                      {t("settings:badgeCount")}
                    </Button>
                    <Button
                      onClick={() =>
                        updateField("notificationBadgeMode", "dot")
                      }
                      sx={optionButtonSx(form.notificationBadgeMode === "dot")}
                    >
                      {t("settings:badgeDot")}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* ── Save button ──────────────────────────────────────────────── */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
              sx={(theme) => ({
                minWidth: 220,
                px: 5,
                py: 1.8,
                borderRadius: "16px",
                textTransform: "none",
                fontSize: scaleFont(16, form.textSize),
                fontWeight: 800,
                letterSpacing: "0.01em",
                background: `linear-gradient(135deg, #ffc02d 0%, ${ACCENT} 50%, #e09a10 100%)`,
                color: "#1a1200",
                boxShadow: `0 4px 24px ${ACCENT_GLOW}, 0 1px 0 rgba(255,255,255,0.3) inset`,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, #ffd060 0%, #ffc02d 50%, ${ACCENT} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 32px rgba(247,174,26,0.38), 0 1px 0 rgba(255,255,255,0.3) inset`,
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
                "&.Mui-disabled": {
                  background: alpha(ACCENT, 0.3),
                  color: alpha("#1a1200", 0.5),
                  boxShadow: "none",
                },
              })}
            >
              {updateSettingsMutation.isPending
                ? t("settings:saving")
                : t("settings:save")}
            </Button>
          </Stack>

        </Stack>
      </Box>
    </Box>
  );
};