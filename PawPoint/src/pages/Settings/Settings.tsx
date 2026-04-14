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

const pageBg = "#f8f4ef";

const sectionCardSx = {
  borderRadius: 4,
  backgroundColor: "#fffdfb",
  border: "1px solid #ebe3da",
  px: { xs: 2, md: 4 },
  py: { xs: 3, md: 4 },
  boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
};

const orangeSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#fff",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#f7ae1a",
    opacity: 1,
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#d1d5db",
    opacity: 1,
  },
};

export const Settings = () => {
  const { t } = useTranslation(["settings"]);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [form, setForm] = useState<UserSettingsDto | null>(null);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const optionButtonSx = (active: boolean) => ({
    flex: 1,
    py: 1.8,
    borderRadius: 2.5,
    textTransform: "none",
    fontSize: scaleFont(16, form?.textSize),
    fontWeight: 700,
    border: active ? "2px solid #f5a623" : "1px solid #ebe7e1",
    backgroundColor: active ? "#f7ae1a" : "#f8f8f8",
    color: "#111827",
    "&:hover": {
      backgroundColor: active ? "#f3a400" : "#f3eee7",
    },
  });

  if (isLoading || !form) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: pageBg,
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Typography color="error">{t("settings:saveError")}</Typography>
      </Box>
    );
  }

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
      textSize: form.textSize,
      weightUnit: form.weightUnit,
      dateFormat: form.dateFormat,
      enableNotifications: form.enableNotifications,
      vaccinationNotifications: form.vaccinationNotifications,
      appointmentNotifications: form.appointmentNotifications,
      dewormingNotifications: form.dewormingNotifications,
      notificationBadgeMode: form.notificationBadgeMode,
    };

    updateSettingsMutation.mutate(payload, {
      onSuccess: (updated) => {
        setForm(updated);
        enqueueSnackbar(t("settings:saved"), { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar(t("settings:saveError"), { variant: "error" });
      },
    });
  };

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
            fontSize: {
              xs: scaleFont(34, form.textSize),
              md: scaleFont(44, form.textSize),
            },
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.05,
          }}
        >
          {t("settings:title")}
        </Typography>

        <Box sx={sectionCardSx}>
          <Stack spacing={4}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PaletteOutlinedIcon sx={{ color: "#6b7280" }} />
              <Typography
                sx={{
                  fontSize: scaleFont(24, form.textSize),
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {t("settings:appearance")}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(18, form.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {t("settings:theme")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(16, form.textSize),
                    color: "#5f7087",
                    mt: 0.5,
                  }}
                >
                  {t("settings:themeSubtitle")}
                </Typography>
              </Box>

              <Switch
                checked={form.darkMode}
                onChange={(e) => updateField("darkMode", e.target.checked)}
                sx={orangeSwitchSx}
              />
            </Stack>

            <Box>
              <Typography
                sx={{
                  fontSize: scaleFont(18, form.textSize),
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                {t("settings:textSize")}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => updateField("textSize", "Small")}
                  sx={optionButtonSx(form.textSize === "Small")}
                >
                  {t("settings:small")}
                </Button>
                <Button
                  onClick={() => updateField("textSize", "Medium")}
                  sx={optionButtonSx(form.textSize === "Medium")}
                >
                  {t("settings:medium")}
                </Button>
                <Button
                  onClick={() => updateField("textSize", "Large")}
                  sx={optionButtonSx(form.textSize === "Large")}
                >
                  {t("settings:large")}
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: scaleFont(18, form.textSize),
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                {t("settings:weightUnits")}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => updateField("weightUnit", "kg")}
                  sx={optionButtonSx(form.weightUnit === "kg")}
                >
                  KG
                </Button>
                <Button
                  onClick={() => updateField("weightUnit", "lb")}
                  sx={optionButtonSx(form.weightUnit === "lb")}
                >
                  LB
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: scaleFont(18, form.textSize),
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                {t("settings:dateFormat")}
              </Typography>

              <FormControl fullWidth>
                <Select
                  value={form.dateFormat}
                  onChange={(e) =>
                    updateField(
                      "dateFormat",
                      e.target.value as UserSettingsDto["dateFormat"]
                    )
                  }
                  sx={{
                    borderRadius: 2.5,
                    backgroundColor: "#fff",
                    fontSize: scaleFont(14, form.textSize),
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ded8cf",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f5a623",
                      borderWidth: 1.5,
                    },
                  }}
                >
                  <MenuItem
                    value="DD/MM/YYYY"
                    sx={{ fontSize: scaleFont(14, form.textSize) }}
                  >
                    DD/MM/YYYY
                  </MenuItem>
                  <MenuItem
                    value="MM/DD/YYYY"
                    sx={{ fontSize: scaleFont(14, form.textSize) }}
                  >
                    MM/DD/YYYY
                  </MenuItem>
                  <MenuItem
                    value="YYYY-MM-DD"
                    sx={{ fontSize: scaleFont(14, form.textSize) }}
                  >
                    YYYY-MM-DD
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        <Box sx={sectionCardSx}>
          <Stack spacing={4}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <NotificationsNoneRoundedIcon sx={{ color: "#6b7280" }} />
              <Typography
                sx={{
                  fontSize: scaleFont(24, form.textSize),
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {t("settings:notifications")}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(18, form.textSize),
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {t("settings:enableNotifications")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(16, form.textSize),
                    color: "#5f7087",
                    mt: 0.5,
                  }}
                >
                  {t("settings:enableNotificationsSubtitle")}
                </Typography>
              </Box>

              <Switch
                checked={form.enableNotifications}
                onChange={(e) => handleToggleNotifications(e.target.checked)}
                sx={orangeSwitchSx}
              />
            </Stack>

            <Divider />

            <Box>
              <Typography
                sx={{
                  fontSize: scaleFont(18, form.textSize),
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2.5,
                }}
              >
                {t("settings:reminderSettings")}
              </Typography>

              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontSize: scaleFont(17, form.textSize),
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {t("settings:vaccinations")}
                  </Typography>
                  <Switch
                    checked={form.vaccinationNotifications}
                    disabled={!form.enableNotifications}
                    onChange={(e) =>
                      updateField("vaccinationNotifications", e.target.checked)
                    }
                    sx={orangeSwitchSx}
                  />
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontSize: scaleFont(17, form.textSize),
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {t("settings:appointments")}
                  </Typography>
                  <Switch
                    checked={form.appointmentNotifications}
                    disabled={!form.enableNotifications}
                    onChange={(e) =>
                      updateField("appointmentNotifications", e.target.checked)
                    }
                    sx={orangeSwitchSx}
                  />
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontSize: scaleFont(17, form.textSize),
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {t("settings:deworming")}
                  </Typography>
                  <Switch
                    checked={form.dewormingNotifications}
                    disabled={!form.enableNotifications}
                    onChange={(e) =>
                      updateField("dewormingNotifications", e.target.checked)
                    }
                    sx={orangeSwitchSx}
                  />
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: scaleFont(18, form.textSize),
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2,
                }}
              >
                {t("settings:badgeMode")}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => updateField("notificationBadgeMode", "count")}
                  sx={optionButtonSx(form.notificationBadgeMode === "count")}
                >
                  {t("settings:badgeCount")}
                </Button>
                <Button
                  onClick={() => updateField("notificationBadgeMode", "dot")}
                  sx={optionButtonSx(form.notificationBadgeMode === "dot")}
                >
                  {t("settings:badgeDot")}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="flex-end">
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            sx={{
              minWidth: 220,
              px: 3.5,
              py: 1.6,
              borderRadius: 2.5,
              textTransform: "none",
              fontSize: scaleFont(18, form.textSize),
              fontWeight: 700,
              color: "#111827",
              backgroundColor: "#f7ae1a",
              boxShadow: "0 8px 20px rgba(245,166,35,0.24)",
              "&:hover": {
                backgroundColor: "#f3a400",
              },
              "&.Mui-disabled": {
                backgroundColor: "#f4d28a",
                color: "#8c7a4e",
              },
            }}
          >
            {updateSettingsMutation.isPending
              ? t("settings:saving")
              : t("settings:save")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};