import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import TuneIcon from "@mui/icons-material/Tune";
import PetsIcon from "@mui/icons-material/Pets";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminUserDetails } from "../../hooks/useAdminUserDetails";
import { useAdminUpdateUserProfile } from "../../hooks/useAdminUpdateUserProfile";
import { useAdminSetUserPassword } from "../../hooks/useAdminSetUserPassword";
import { useAdminUpdateUserSettings } from "../../hooks/useAdminUpdateUserSettings";
import { useDeactivateUser } from "../../hooks/useDeactivateUser";
import { useRestoreUser } from "../../hooks/useRestoreUser";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";

type UserDetailsForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
};

type SettingsForm = {
  darkMode: boolean;
  textSize: string;
  weightUnit: string;
  dateFormat: string;
  notificationPreferenceId: number;
  enableNotifications: boolean;
  vaccinationNotifications: boolean;
  appointmentNotifications: boolean;
  dewormingNotifications: boolean;
  notificationBadgeMode: string;
};

// ─── Shared style tokens ─────────────────────────────────────────────────────
const navy = "#071c42";
const slate = "#64748b";
const accent = "#2563eb";
const accentLight = "#eff6ff";
const border = "1.5px solid #e2e8f0";
const radius = 4;

const sectionCard = {
  borderRadius: radius,
  border,
  boxShadow: "0 1px 4px 0 rgba(7,28,66,0.06)",
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: "0 4px 16px 0 rgba(7,28,66,0.10)" },
};

const sectionTitle = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: slate,
  mb: 2.5,
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const primaryBtn = {
  borderRadius: 2,
  textTransform: "none" as const,
  fontWeight: 700,
  fontSize: 14,
  px: 3,
  py: 1.1,
  boxShadow: "none",
  "&:hover": { boxShadow: "0 2px 8px rgba(37,99,235,0.18)" },
};

const outlinedBtn = {
  borderRadius: 2,
  textTransform: "none" as const,
  fontWeight: 700,
  fontSize: 14,
  px: 3,
  py: 1.1,
  borderColor: "#cbd5e1",
  color: navy,
  "&:hover": { borderColor: navy, background: "#f8fafc" },
};

const fieldProps = {
  size: "small" as const,
  sx: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: 14,
    },
    "& .MuiInputLabel-root": { fontSize: 13 },
  },
};

// ─── Toggle row ───────────────────────────────────────────────────────────────
const ToggleRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      px: 2,
      py: 1.2,
      borderRadius: 2,
      border,
      background: checked ? accentLight : "#f8fafc",
      transition: "background 0.15s",
      minWidth: 220,
      flex: "1 1 220px",
    }}
  >
    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: navy }}>
      {label}
    </Typography>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size="small"
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": { color: accent },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: accent,
        },
      }}
    />
  </Stack>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const AdminUserDetails = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const userId = Number(id);

  const detailsQuery = useAdminUserDetails(userId);
  const updateProfileMutation = useAdminUpdateUserProfile();
  const setPasswordMutation = useAdminSetUserPassword();
  const updateSettingsMutation = useAdminUpdateUserSettings();
  const deactivateMutation = useDeactivateUser();
  const restoreMutation = useRestoreUser();

  const [profileForm, setProfileForm] = useState<UserDetailsForm>({
    fullName: "",
    email: "",
    phoneNumber: "",
    isEmailConfirmed: false,
  });

  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    darkMode: false,
    textSize: "Medium",
    weightUnit: "kg",
    dateFormat: "dd/MM/yyyy",
    notificationPreferenceId: 1,
    enableNotifications: true,
    vaccinationNotifications: true,
    appointmentNotifications: true,
    dewormingNotifications: true,
    notificationBadgeMode: "all",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const details = detailsQuery.data;
  const user = details?.user ?? {};
  const settings = details?.settings ?? null;
  const animals = details?.animals ?? [];

  useEffect(() => {
    if (!details) return;
    setProfileForm({
      fullName: String(user.FullName ?? ""),
      email: String(user.Email ?? ""),
      phoneNumber: String(user.PhoneNumber ?? ""),
      isEmailConfirmed: Boolean(user.IsEmailConfirmed ?? false),
    });
    setSettingsForm({
      darkMode: Boolean(settings?.DarkMode ?? false),
      textSize: String(settings?.TextSize ?? "Medium"),
      weightUnit: String(settings?.WeightUnit ?? "kg"),
      dateFormat: String(settings?.DateFormat ?? "dd/MM/yyyy"),
      notificationPreferenceId: Number(user.NotificationPreferenceId ?? 1),
      enableNotifications: Boolean(settings?.EnableNotifications ?? true),
      vaccinationNotifications: Boolean(settings?.VaccinationNotifications ?? true),
      appointmentNotifications: Boolean(settings?.AppointmentNotifications ?? true),
      dewormingNotifications: Boolean(settings?.DewormingNotifications ?? true),
      notificationBadgeMode: String(settings?.NotificationBadgeMode ?? "all"),
    });
  }, [details, settings, user]);

  const isDeleted = useMemo(() => Boolean(user.IsDeleted ?? false), [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        userId,
        payload: {
          fullName: profileForm.fullName,
          email: profileForm.email,
          phoneNumber: profileForm.phoneNumber || null,
          isEmailConfirmed: profileForm.isEmailConfirmed,
        },
      });
      enqueueSnackbar("User profile updated.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not update profile.", { variant: "error" });
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword || !confirmPassword) {
      enqueueSnackbar("Both password fields are required.", { variant: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match.", { variant: "error" });
      return;
    }
    try {
      await setPasswordMutation.mutateAsync({ userId, payload: { newPassword } });
      setNewPassword("");
      setConfirmPassword("");
      enqueueSnackbar("Password updated.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not update password.", { variant: "error" });
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({ userId, payload: settingsForm });
      enqueueSnackbar("Settings updated.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not update settings.", { variant: "error" });
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateMutation.mutateAsync(userId);
      enqueueSnackbar("User deactivated.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not deactivate user.", { variant: "error" });
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(userId);
      enqueueSnackbar("User restored.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not restore user.", { variant: "error" });
    }
  };

  if (detailsQuery.isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
        <CircularProgress size={36} sx={{ color: accent }} />
      </Stack>
    );
  }

  if (detailsQuery.isError || !details) {
    return <Alert severity="error">Could not load user details.</Alert>;
  }

  const initials = String(user.FullName ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Stack spacing={3} sx={{ maxWidth: 1100, mx: "auto", pb: 6 }}>
      {/* ── Page header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            sx={{ fontSize: 28, fontWeight: 900, color: navy, letterSpacing: "-0.5px", lineHeight: 1.2 }}
          >
            Manage User
          </Typography>
          <Typography sx={{ color: slate, mt: 0.5, fontSize: 14 }}>
            Full control over profile, settings, password and animals.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate("/admin")}
          sx={outlinedBtn}
        >
          Back to Admin
        </Button>
      </Stack>

      {/* ── Identity banner ── */}
      <Card sx={{ ...sectionCard, background: navy, color: "#fff" }}>
        <CardContent sx={{ py: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  background: accent,
                  fontSize: 18,
                  fontWeight: 800,
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                    {String(user.FullName ?? "")}
                  </Typography>
                  {isDeleted ? (
                    <Chip
                      label="Deactivated"
                      size="small"
                      sx={{ background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 11, height: 20 }}
                    />
                  ) : (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{ background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 11, height: 20 }}
                    />
                  )}
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13.5, mt: 0.3 }}>
                  {String(user.Email ?? "")}
                  {user.Role ? (
                    <Box component="span" sx={{ ml: 1.5, opacity: 0.55 }}>
                      · {String(user.Role)}
                    </Box>
                  ) : null}
                </Typography>
              </Box>
            </Stack>

            {isDeleted ? (
              <Button
                variant="contained"
                onClick={handleRestore}
                sx={{ ...primaryBtn, background: "#22c55e", "&:hover": { background: "#16a34a" } }}
              >
                Restore User
              </Button>
            ) : (
              <Button
                color="error"
                variant="outlined"
                onClick={handleDeactivate}
                sx={{
                  ...primaryBtn,
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  "&:hover": { background: "rgba(239,68,68,0.08)", borderColor: "#dc2626" },
                }}
              >
                Deactivate User
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ── Profile + Security row ── */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        {/* Profile */}
        <Card sx={{ ...sectionCard, flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitle}>
              <PersonIcon sx={{ fontSize: 15, color: accent }} />
              Profile
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                fullWidth
                {...fieldProps}
              />
              <TextField
                label="Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                fullWidth
                {...fieldProps}
              />
              <TextField
                label="Phone Number"
                value={profileForm.phoneNumber}
                onChange={(e) => setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                fullWidth
                {...fieldProps}
              />

              <ToggleRow
                label="Email confirmed"
                checked={profileForm.isEmailConfirmed}
                onChange={(v) => setProfileForm((p) => ({ ...p, isEmailConfirmed: v }))}
              />

              <Box>
                <Button variant="contained" onClick={handleSaveProfile} sx={primaryBtn}>
                  Save Profile
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Security */}
        <Card sx={{ ...sectionCard, flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitle}>
              <LockIcon sx={{ fontSize: 15, color: accent }} />
              Security
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                {...fieldProps}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                {...fieldProps}
              />
              <Box>
                <Button variant="contained" onClick={handleSavePassword} sx={primaryBtn}>
                  Save New Password
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* ── Settings ── */}
      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={sectionTitle}>
            <TuneIcon sx={{ fontSize: 15, color: accent }} />
            Settings
          </Typography>

          <Stack spacing={2.5}>
            {/* Row 1: dropdowns */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Text Size"
                value={settingsForm.textSize}
                onChange={(e) => setSettingsForm((p) => ({ ...p, textSize: e.target.value }))}
                fullWidth
                select
                {...fieldProps}
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </TextField>

              <TextField
                label="Weight Unit"
                value={settingsForm.weightUnit}
                onChange={(e) => setSettingsForm((p) => ({ ...p, weightUnit: e.target.value }))}
                fullWidth
                select
                {...fieldProps}
              >
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="lb">lb</MenuItem>
              </TextField>

              <TextField
                label="Date Format"
                value={settingsForm.dateFormat}
                onChange={(e) => setSettingsForm((p) => ({ ...p, dateFormat: e.target.value }))}
                fullWidth
                {...fieldProps}
              />
            </Stack>

            {/* Row 2: notification fields */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Notification Preference Id"
                type="number"
                value={settingsForm.notificationPreferenceId}
                onChange={(e) =>
                  setSettingsForm((p) => ({ ...p, notificationPreferenceId: Number(e.target.value) }))
                }
                fullWidth
                {...fieldProps}
              />
              <TextField
                label="Notification Badge Mode"
                value={settingsForm.notificationBadgeMode}
                onChange={(e) => setSettingsForm((p) => ({ ...p, notificationBadgeMode: e.target.value }))}
                fullWidth
                {...fieldProps}
              />
            </Stack>

            {/* Toggles */}
            <Divider sx={{ borderColor: "#f1f5f9" }} />
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {(
                [
                  ["Dark Mode", "darkMode"],
                  ["Enable Notifications", "enableNotifications"],
                  ["Vaccination Notifications", "vaccinationNotifications"],
                  ["Appointment Notifications", "appointmentNotifications"],
                  ["Deworming Notifications", "dewormingNotifications"],
                ] as [string, keyof SettingsForm][]
              ).map(([label, key]) => (
                <ToggleRow
                  key={key}
                  label={label}
                  checked={Boolean(settingsForm[key])}
                  onChange={(v) => setSettingsForm((p) => ({ ...p, [key]: v }))}
                />
              ))}
            </Stack>

            <Box>
              <Button variant="contained" onClick={handleSaveSettings} sx={primaryBtn}>
                Save Settings
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Animals & Records ── */}
      <Card sx={sectionCard}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Typography sx={sectionTitle}>
              <PetsIcon sx={{ fontSize: 15, color: accent }} />
              Animals & Records
            </Typography>
            <Chip
              label={`${animals.length} animal${animals.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                background: accentLight,
                color: accent,
                fontWeight: 700,
                fontSize: 12,
                height: 22,
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            {animals.map((item, index) => {
              const animal = item.animal;
              return (
                <Accordion
                  key={index}
                  disableGutters
                  sx={{
                    borderRadius: "10px !important",
                    border,
                    boxShadow: "none",
                    overflow: "hidden",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": {
                      boxShadow: "0 2px 12px rgba(7,28,66,0.08)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: slate, fontSize: 20 }} />}
                    sx={{
                      px: 2.5,
                      py: 1,
                      minHeight: 56,
                      "&.Mui-expanded": { minHeight: 56, background: accentLight },
                      "& .MuiAccordionSummary-content": { my: 1 },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: "#e0e7ff",
                          color: accent,
                          fontSize: 18,
                        }}
                      >
                        <PetsIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: navy, fontSize: 14.5, lineHeight: 1.3 }}>
                          {String(animal.Name ?? `Animal #${index + 1}`)}
                        </Typography>
                        <Typography sx={{ color: slate, fontSize: 12.5 }}>
                          {String(animal.Species ?? "")}
                          {animal.Breed ? ` · ${String(animal.Breed)}` : ""}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} ml="auto" mr={1} alignItems="center">
                      {[
                        { label: "Vax", count: item.vaccinations.length },
                        { label: "Deworm", count: item.dewormings.length },
                        { label: "Feed", count: item.feedings.length },
                        { label: "Appt", count: item.appointments.length },
                      ].map(({ label, count }) => (
                        <Chip
                          key={label}
                          label={`${count} ${label}`}
                          size="small"
                          sx={{
                            background: "#f1f5f9",
                            color: slate,
                            fontSize: 11,
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
                      ))}
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <Stack divider={<Divider sx={{ borderColor: "#f1f5f9" }} />}>
                      {[
                        { label: "Animal Details", data: animal, count: null },
                        { label: "Vaccinations", data: item.vaccinations, count: item.vaccinations.length },
                        { label: "Dewormings", data: item.dewormings, count: item.dewormings.length },
                        { label: "Feedings", data: item.feedings, count: item.feedings.length },
                        { label: "Appointments", data: item.appointments, count: item.appointments.length },
                      ].map(({ label, data, count }) => (
                        <Box key={label} sx={{ px: 3, py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: navy }}>
                              {label}
                            </Typography>
                            {count !== null && (
                              <Chip
                                label={count}
                                size="small"
                                sx={{
                                  background: accentLight,
                                  color: accent,
                                  fontWeight: 700,
                                  fontSize: 11,
                                  height: 18,
                                  minWidth: 24,
                                }}
                              />
                            )}
                          </Stack>
                          <Box
                            component="pre"
                            sx={{
                              m: 0,
                              p: 2,
                              background: "#f8fafc",
                              border,
                              borderRadius: 2,
                              fontSize: 12,
                              color: "#334155",
                              whiteSpace: "pre-wrap",
                              lineHeight: 1.6,
                              fontFamily: "'Fira Mono', 'Cascadia Code', monospace",
                            }}
                          >
                            {JSON.stringify(data, null, 2)}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};