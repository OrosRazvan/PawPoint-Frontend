import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
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

const navy = "#071c42";
const slate = "#64748b";
const accent = "#2563eb";
const accentLight = "#eff6ff";
const border = "1px solid rgba(7,28,66,0.08)";
const radius = 5;

const sectionCard = {
  borderRadius: radius,
  border,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.10)",
    borderColor: "rgba(7,28,66,0.14)",
  },
};

const sectionTitle = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: slate,
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const primaryBtn = {
  borderRadius: 3,
  textTransform: "none" as const,
  fontWeight: 800,
  fontSize: 14,
  px: 2.5,
  py: 1.15,
  boxShadow: "0 10px 24px rgba(25, 118, 210, 0.22)",
};

const outlinedBtn = {
  borderRadius: 3,
  textTransform: "none" as const,
  fontWeight: 800,
  fontSize: 14,
  px: 2.5,
  py: 1.05,
  borderColor: "#cbd5e1",
  color: navy,
  "&:hover": { borderColor: navy, background: "#f8fafc" },
};

const fieldProps = {
  size: "small" as const,
  sx: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      fontSize: 14,
      backgroundColor: "#fff",
    },
    "& .MuiInputLabel-root": { fontSize: 13 },
  },
};

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
      py: 1.3,
      borderRadius: 3,
      border,
      background: checked ? accentLight : "#f8fafc",
      minWidth: 220,
      flex: "1 1 220px",
      transition: "all 0.15s ease",
    }}
  >
    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: navy }}>
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
    <Stack
      spacing={3.5}
      sx={{
        px: { xs: 2, sm: 3, md: 5, lg: 7 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 34 },
              fontWeight: 900,
              color: navy,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Manage User
          </Typography>
          <Typography sx={{ color: slate, mt: 0.75, fontSize: 15 }}>
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

      <Card
        elevation={0}
        sx={{
          ...sectionCard,
          background: `linear-gradient(135deg, ${navy} 0%, #0b2557 100%)`,
          color: "#fff",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2.5}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: accent,
                  fontSize: 20,
                  fontWeight: 900,
                  border: "2px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                {initials}
              </Avatar>

              <Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1.25}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                    {String(user.FullName ?? "")}
                  </Typography>

                  {isDeleted ? (
                    <Chip
                      label="Deactivated"
                      size="small"
                      sx={{
                        background: "#ef4444",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 11,
                        height: 22,
                      }}
                    />
                  ) : (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        background: "#22c55e",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 11,
                        height: 22,
                      }}
                    />
                  )}
                </Stack>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 14,
                    mt: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {String(user.Email ?? "")}
                  {user.Role ? (
                    <Box component="span" sx={{ ml: 1.25, opacity: 0.6 }}>
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
                sx={{
                  ...primaryBtn,
                  background: "#22c55e",
                  "&:hover": { background: "#16a34a" },
                }}
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
                  boxShadow: "none",
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  "&:hover": {
                    background: "rgba(239,68,68,0.08)",
                    borderColor: "#dc2626",
                  },
                }}
              >
                Deactivate User
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", xl: "row" }} spacing={3}>
        <Card elevation={0} sx={{ ...sectionCard, flex: 1 }}>
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack spacing={2.5}>
              <Typography sx={sectionTitle}>
                <PersonIcon sx={{ fontSize: 16, color: accent }} />
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
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ ...sectionCard, flex: 1 }}>
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack spacing={2.5}>
              <Typography sx={sectionTitle}>
                <LockIcon sx={{ fontSize: 16, color: accent }} />
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
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card elevation={0} sx={sectionCard}>
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack spacing={2.75}>
            <Typography sx={sectionTitle}>
              <TuneIcon sx={{ fontSize: 16, color: accent }} />
              Settings
            </Typography>

            <Stack spacing={2.25}>
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

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Notification Preference Id"
                  type="number"
                  value={settingsForm.notificationPreferenceId}
                  onChange={(e) =>
                    setSettingsForm((p) => ({
                      ...p,
                      notificationPreferenceId: Number(e.target.value),
                    }))
                  }
                  fullWidth
                  {...fieldProps}
                />
                <TextField
                  label="Notification Badge Mode"
                  value={settingsForm.notificationBadgeMode}
                  onChange={(e) =>
                    setSettingsForm((p) => ({
                      ...p,
                      notificationBadgeMode: e.target.value,
                    }))
                  }
                  fullWidth
                  {...fieldProps}
                />
              </Stack>

              <Divider sx={{ borderColor: "#eef2f7" }} />

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
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={sectionCard}>
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Typography sx={sectionTitle}>
                <PetsIcon sx={{ fontSize: 16, color: accent }} />
                Animals & Records
              </Typography>

              <Chip
                label={`${animals.length} animal${animals.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  background: accentLight,
                  color: accent,
                  fontWeight: 800,
                  fontSize: 12,
                  height: 24,
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
                    elevation={0}
                    sx={{
                      borderRadius: "16px !important",
                      border,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                      "&:before": { display: "none" },
                      "&.Mui-expanded": {
                        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
                        borderColor: "rgba(7,28,66,0.14)",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: slate, fontSize: 20 }} />}
                      sx={{
                        px: { xs: 2, md: 2.5 },
                        py: 1,
                        minHeight: 72,
                        "&.Mui-expanded": {
                          minHeight: 72,
                          background: accentLight,
                        },
                        "& .MuiAccordionSummary-content": {
                          my: 1,
                          alignItems: "center",
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={2}
                        sx={{ width: "100%" }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.75}>
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              background: "#e0e7ff",
                              color: accent,
                            }}
                          >
                            <PetsIcon sx={{ fontSize: 20 }} />
                          </Avatar>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: navy,
                                fontSize: 15,
                                lineHeight: 1.3,
                              }}
                            >
                              {String(animal.Name ?? `Animal #${index + 1}`)}
                            </Typography>
                            <Typography sx={{ color: slate, fontSize: 12.5, mt: 0.25 }}>
                              {String(animal.Species ?? "")}
                              {animal.Breed ? ` · ${String(animal.Breed)}` : ""}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                          sx={{ ml: { md: "auto" } }}
                        >
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
                                fontWeight: 700,
                                height: 22,
                                borderRadius: 2.5,
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                      <Stack divider={<Divider sx={{ borderColor: "#eef2f7" }} />}>
                        {[
                          { label: "Animal Details", data: animal, count: null },
                          { label: "Vaccinations", data: item.vaccinations, count: item.vaccinations.length },
                          { label: "Dewormings", data: item.dewormings, count: item.dewormings.length },
                          { label: "Feedings", data: item.feedings, count: item.feedings.length },
                          { label: "Appointments", data: item.appointments, count: item.appointments.length },
                        ].map(({ label, data, count }) => (
                          <Box key={label} sx={{ px: { xs: 2, md: 3 }, py: 2.25 }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1.25}>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: 13,
                                  color: navy,
                                }}
                              >
                                {label}
                              </Typography>

                              {count !== null && (
                                <Chip
                                  label={count}
                                  size="small"
                                  sx={{
                                    background: accentLight,
                                    color: accent,
                                    fontWeight: 800,
                                    fontSize: 11,
                                    height: 20,
                                    minWidth: 26,
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
                                borderRadius: 3,
                                fontSize: 12,
                                color: "#334155",
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.65,
                                fontFamily: "'Fira Mono', 'Cascadia Code', monospace",
                                overflowX: "auto",
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
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};