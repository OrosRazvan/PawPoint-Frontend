import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import { useAppointments } from "../../hooks/useAppointments";
import { useVaccinations } from "../../hooks/useVaccinations";
import { useDewormings } from "../../hooks/useDewormings";
import { useSettings } from "../../hooks/useSettings";
import { useDashboard } from "../../hooks/useDashboard";
import { scaleFont } from "../../utils/fontScale";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { clearTokens } from "../../auth/tokenStorage";
import { useTranslation } from "react-i18next";

type ActivityItem = {
  id: string;
  type: "appointment" | "vaccination" | "deworming";
  title: string;
  dateValue: string;
  clinic: string;
};

type AppDateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

const formatDateBySettings = (
  value?: string | Date | null,
  format: AppDateFormat = "DD/MM/YYYY"
) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

const getInitial = (name?: string | null) => {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfile();

  const { data: appointments = [] } = useAppointments();
  const { data: vaccinations = [] } = useVaccinations();
  const { data: dewormings = [] } = useDewormings();
  const { data: dashboardData } = useDashboard();
  const { data: settings } = useSettings();

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const safeProfile = profile ?? {
    fullName: "",
    email: "",
    phoneNumber: "",
    profilePictureUrl: "",
  };

  const pets = dashboardData?.pets ?? [];

  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  const cardSx = (theme: any) => ({
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 10px 24px rgba(0,0,0,0.28)"
        : "0 10px 24px rgba(0,0,0,0.05)",
  });

  const editableFieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      fontSize: scaleFont(14, settings?.textSize),
      color: theme.palette.text.primary,
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: theme.palette.text.primary,
      },
    },
  });

  const handleLogout = () => {
    clearTokens();
    sessionStorage.clear();
    window.location.replace("/");
  };

  useEffect(() => {
    setFullName(safeProfile.fullName ?? "");
    setPhoneNumber(safeProfile.phoneNumber ?? "");
  }, [safeProfile.fullName, safeProfile.phoneNumber]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const activityItems = useMemo<ActivityItem[]>(() => {
    const appointmentItems: ActivityItem[] = appointments.map((item: any) => ({
      id: `appointment-${item.id}`,
      type: "appointment",
      title: t("activityForPet", {
        activity: item.serviceType ?? t("appointmentFallback"),
        pet: item.animalName ?? t("petFallback"),
      }),
      dateValue:
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        "",
      clinic:
        item.vetCabinetName ??
        item.VetCabinetName ??
        item.veterinarianName ??
        item.VeterinarianName ??
        item.clinicName ??
        item.ClinicName ??
        t("clinicFallback"),
    }));

    const vaccinationItems: ActivityItem[] = vaccinations.map((item: any) => ({
      id: `vaccination-${item.id}`,
      type: "vaccination",
      title: t("activityForPet", {
        activity: item.vaccineName ?? t("vaccinationFallback"),
        pet: item.animalName ?? t("petFallback"),
      }),
      dateValue:
        item.dateUtc ??
        item.DateUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.scheduledAtUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        item.nextDateUtc ??
        item.NextDateUtc ??
        item.nextDate ??
        item.NextDate ??
        item.date ??
        item.Date ??
        "",
      clinic:
        item.vetCabinetName ??
        item.VetCabinetName ??
        item.veterinarianName ??
        item.VeterinarianName ??
        item.clinicName ??
        item.ClinicName ??
        t("clinicFallback"),
    }));

    const dewormingItems: ActivityItem[] = dewormings.map((item: any) => ({
      id: `deworming-${item.id}`,
      type: "deworming",
      title: t("activityForPet", {
        activity: item.productName ?? item.type ?? t("dewormingFallback"),
        pet: item.animalName ?? t("petFallback"),
      }),
      dateValue:
        item.dateUtc ??
        item.DateUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.scheduledAtUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        item.nextDateUtc ??
        item.NextDateUtc ??
        item.nextDate ??
        item.NextDate ??
        item.date ??
        item.Date ??
        "",
      clinic:
        item.vetCabinetName ??
        item.VetCabinetName ??
        item.veterinarianName ??
        item.VeterinarianName ??
        item.clinicName ??
        item.ClinicName ??
        t("clinicFallback"),
    }));

    return [...appointmentItems, ...vaccinationItems, ...dewormingItems]
      .sort((a, b) => {
        const aTime = new Date(a.dateValue).getTime();
        const bTime = new Date(b.dateValue).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [appointments, vaccinations, dewormings, t]);

  const handleSaveName = () => {
    updateProfile(
      {
        fullName,
        phoneNumber: safeProfile.phoneNumber ?? "",
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("nameUpdatedSuccess"), { variant: "success" });
          setIsEditingName(false);
        },
        onError: () => {
          enqueueSnackbar(t("nameUpdatedError"), { variant: "error" });
        },
      }
    );
  };

  const handleSavePhone = () => {
    updateProfile(
      {
        fullName: safeProfile.fullName ?? "",
        phoneNumber,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("phoneUpdatedSuccess"), { variant: "success" });
          setIsEditingPhone(false);
        },
        onError: () => {
          enqueueSnackbar(t("phoneUpdatedError"), { variant: "error" });
        },
      }
    );
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      enqueueSnackbar("Poți încărca doar JPG, PNG sau WEBP.", {
        variant: "error",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      enqueueSnackbar(`Imaginea trebuie să aibă maxim ${MAX_IMAGE_SIZE_MB} MB.`, {
        variant: "error",
      });
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setSelectedProfilePicture(file);
    setPreviewUrl(localPreviewUrl);
    event.target.value = "";
  };

  const handleSaveProfilePicture = () => {
    if (!selectedProfilePicture) {
      return;
    }

    updateProfile(
      {
        fullName: safeProfile.fullName ?? "",
        phoneNumber: safeProfile.phoneNumber ?? "",
        profilePicture: selectedProfilePicture,
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Poza de profil a fost actualizată.", {
            variant: "success",
          });
          setSelectedProfilePicture(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl("");
        },
        onError: () => {
          enqueueSnackbar("Nu s-a putut actualiza poza de profil.", {
            variant: "error",
          });
        },
      }
    );
  };

  const displayedProfilePicture = previewUrl || safeProfile.profilePictureUrl || "";

  if (isProfileLoading) {
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
        <CircularProgress />
      </Box>
    );
  }

  if (isProfileError) {
    return (
      <Box
        sx={(theme) => ({
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          p: 4,
        })}
      >
        <Typography color="error">{t("loadError")}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      })}
    >
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Typography
          sx={(theme) => ({
            fontSize: {
              xs: scaleFont(30, settings?.textSize),
              sm: scaleFont(34, settings?.textSize),
              md: scaleFont(42, settings?.textSize),
            },
            fontWeight: 800,
            color: theme.palette.text.primary,
            lineHeight: 1.1,
          })}
        >
          {t("title")}
        </Typography>

        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, xl: 4 }}>
            <Box
              sx={(theme) => ({
                ...cardSx(theme),
                p: { xs: 2.5, sm: 3, md: 4 },
                height: "100%",
              })}
            >
              <Stack spacing={3}>
                <Stack alignItems="center" spacing={2}>
                  {displayedProfilePicture ? (
                    <Avatar
                      src={displayedProfilePicture}
                      sx={{
                        width: { xs: 96, sm: 110, md: 120 },
                        height: { xs: 96, sm: 110, md: 120 },
                        fontSize: scaleFont(40, settings?.textSize),
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={(theme) => ({
                        width: { xs: 96, sm: 110, md: 120 },
                        height: { xs: 96, sm: 110, md: 120 },
                        fontSize: scaleFont(40, settings?.textSize),
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                        color: theme.palette.mode === "dark" ? "#111827" : "#ffffff",
                      })}
                    >
                      {getInitial(safeProfile.fullName)}
                    </Avatar>
                  )}

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    <Button
                      component="label"
                      startIcon={<PhotoCameraOutlinedIcon />}
                      disabled={isUpdatingProfile}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                      variant="outlined"
                    >
                      Alege poză
                      <input
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleProfilePictureChange}
                      />
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      onClick={handleSaveProfilePicture}
                      disabled={!selectedProfilePicture || isUpdatingProfile}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Salvează poza
                    </Button>
                  </Stack>

                  <Box sx={{ textAlign: "center", maxWidth: "100%" }}>
                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(22, settings?.textSize),
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        wordBreak: "break-word",
                      })}
                    >
                      {safeProfile.fullName}
                    </Typography>

                    <Typography
                      sx={(theme) => ({
                        mt: 1,
                        fontSize: scaleFont(16, settings?.textSize),
                        color: theme.palette.text.secondary,
                        wordBreak: "break-word",
                      })}
                    >
                      {safeProfile.email}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={(theme) => ({
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 3,
                  })}
                >
                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(18, settings?.textSize),
                      fontWeight: 800,
                      color: theme.palette.text.primary,
                      mb: 3,
                    })}
                  >
                    {t("accountInformation")}
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box>
                      <Typography
                        sx={(theme) => ({
                          fontSize: scaleFont(15, settings?.textSize),
                          fontWeight: 700,
                          color: theme.palette.text.secondary,
                          mb: 1,
                        })}
                      >
                        {t("fullName")}
                      </Typography>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <TextField
                          fullWidth
                          value={fullName}
                          disabled={!isEditingName}
                          onChange={(e) => setFullName(e.target.value)}
                          sx={editableFieldSx}
                        />

                        <IconButton
                          onClick={() => {
                            if (isEditingName) {
                              handleSaveName();
                            } else {
                              setIsEditingName(true);
                            }
                          }}
                          disabled={isUpdatingProfile}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            flexShrink: 0,
                            color: "#ffffff",
                            background:
                              "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                            boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                              boxShadow: "0 6px 16px rgba(245,166,35,0.45)",
                              transform: "translateY(-1px)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.6,
                              color: "#fff",
                            },
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Box>
                      <Typography
                        sx={(theme) => ({
                          fontSize: scaleFont(15, settings?.textSize),
                          fontWeight: 700,
                          color: theme.palette.text.secondary,
                          mb: 1,
                        })}
                      >
                        {t("email")}
                      </Typography>

                      <TextField
                        fullWidth
                        value={safeProfile.email ?? ""}
                        disabled
                        sx={editableFieldSx}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={(theme) => ({
                          fontSize: scaleFont(15, settings?.textSize),
                          fontWeight: 700,
                          color: theme.palette.text.secondary,
                          mb: 1,
                        })}
                      >
                        {t("phone")}
                      </Typography>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <TextField
                          fullWidth
                          value={phoneNumber}
                          disabled={!isEditingPhone}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          sx={editableFieldSx}
                        />

                        <IconButton
                          onClick={() => {
                            if (isEditingPhone) {
                              handleSavePhone();
                            } else {
                              setIsEditingPhone(true);
                            }
                          }}
                          disabled={isUpdatingProfile}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            flexShrink: 0,
                            color: "#ffffff",
                            background:
                              "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                            boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                              boxShadow: "0 6px 16px rgba(245,166,35,0.45)",
                              transform: "translateY(-1px)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.6,
                              color: "#fff",
                            },
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Button
                      onClick={() => navigate("/change-password")}
                      sx={(theme) => ({
                        mt: 1,
                        py: 1.6,
                        borderRadius: 2.5,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha("#ffffff", 0.06)
                            : "#efefef",
                        color: theme.palette.text.primary,
                        textTransform: "none",
                        fontSize: scaleFont(16, settings?.textSize),
                        fontWeight: 700,
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha("#ffffff", 0.1)
                              : "#e6e6e6",
                        },
                      })}
                    >
                      {t("changePassword")}
                    </Button>

                    <Button
                      startIcon={<LogoutOutlinedIcon />}
                      onClick={handleLogout}
                      sx={(theme) => ({
                        py: 1.6,
                        borderRadius: 2.5,
                        backgroundColor: alpha(theme.palette.error.main, 0.12),
                        color: theme.palette.error.main,
                        textTransform: "none",
                        fontSize: scaleFont(16, settings?.textSize),
                        fontWeight: 700,
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.error.main, 0.18),
                        },
                      })}
                    >
                      {t("logout")}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, xl: 8 }}>
            <Box
              sx={(theme) => ({
                ...cardSx(theme),
                p: { xs: 2.5, sm: 3, md: 4 },
                height: "100%",
              })}
            >
              <Stack spacing={3}>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                  })}
                >
                  {t("recentActivity")}
                </Typography>

                <Stack spacing={2}>
                  {activityItems.map((item) => {
                    const icon =
                      item.type === "appointment" ? (
                        <CalendarMonthRoundedIcon
                          sx={(theme) => ({ color: theme.palette.secondary.main })}
                        />
                      ) : item.type === "vaccination" ? (
                        <VaccinesRoundedIcon
                          sx={(theme) => ({ color: theme.palette.info.main })}
                        />
                      ) : (
                        <BugReportRoundedIcon
                          sx={(theme) => ({ color: theme.palette.success.main })}
                        />
                      );

                    const chipLabel =
                      item.type === "appointment"
                        ? t("appointment")
                        : item.type === "vaccination"
                        ? t("vaccination")
                        : t("deworming");

                    return (
                      <Box
                        key={item.id}
                        sx={(theme) => ({
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 3,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha("#ffffff", 0.03)
                              : "#fff",
                          px: { xs: 1.75, sm: 2.25, md: 2.5 },
                          py: { xs: 1.75, sm: 2.25, md: 2.5 },
                        })}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "flex-start" }}
                          spacing={2}
                        >
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Box
                              sx={(theme) => ({
                                width: { xs: 46, sm: 54 },
                                height: { xs: 46, sm: 54 },
                                borderRadius: 2.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  item.type === "appointment"
                                    ? alpha(theme.palette.secondary.main, 0.16)
                                    : item.type === "vaccination"
                                    ? alpha(theme.palette.info.main, 0.14)
                                    : alpha(theme.palette.success.main, 0.14),
                                flexShrink: 0,
                              })}
                            >
                              {icon}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={(theme) => ({
                                  fontSize: scaleFont(18, settings?.textSize),
                                  fontWeight: 800,
                                  color: theme.palette.text.primary,
                                  wordBreak: "break-word",
                                })}
                              >
                                {item.title}
                              </Typography>

                              <Typography
                                sx={(theme) => ({
                                  mt: 1,
                                  fontSize: scaleFont(15, settings?.textSize),
                                  color: theme.palette.text.secondary,
                                })}
                              >
                                {formatDateBySettings(item.dateValue, dateFormat)}
                              </Typography>

                              <Typography
                                sx={(theme) => ({
                                  mt: 0.6,
                                  fontSize: scaleFont(15, settings?.textSize),
                                  color: theme.palette.text.secondary,
                                  wordBreak: "break-word",
                                })}
                              >
                                {t("atClinic", { clinic: item.clinic })}
                              </Typography>
                            </Box>
                          </Stack>

                          <Chip
                            label={chipLabel}
                            sx={(theme) => ({
                              borderRadius: 999,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? alpha("#ffffff", 0.06)
                                  : "#f2f4f7",
                              color: theme.palette.text.secondary,
                              fontSize: scaleFont(13, settings?.textSize),
                              alignSelf: { xs: "flex-start", sm: "flex-start" },
                            })}
                          />
                        </Stack>
                      </Box>
                    );
                  })}

                  {activityItems.length === 0 && (
                    <Typography
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        fontSize: scaleFont(16, settings?.textSize),
                      })}
                    >
                      {t("noRecentActivity")}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: { xs: 2.5, sm: 3, md: 4 },
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 10px 24px rgba(0,0,0,0.24)"
                    : "0 10px 24px rgba(0,0,0,0.05)",
              })}
            >
              <Stack spacing={3}>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(22, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {t("myPets")}
                </Typography>

                {pets.length > 0 ? (
                  <Grid container spacing={3}>
                    {pets.map((pet: any) => (
                      <Grid key={pet.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Paper
                          elevation={0}
                          sx={(theme) => ({
                            p: 2,
                            borderRadius: 4,
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,
                            transition: "box-shadow 0.2s ease, transform 0.2s ease",
                            "&:hover": {
                              boxShadow:
                                theme.palette.mode === "dark"
                                  ? "0 12px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)"
                                  : "0 12px 32px rgba(7,28,66,0.09), 0 2px 8px rgba(7,28,66,0.04)",
                              transform: "translateY(-2px)",
                            },
                          })}
                        >
                          <Box
                            sx={(theme) => ({
                              height: 180,
                              borderRadius: 3,
                              background: pet.imageUrl
                                ? "transparent"
                                : theme.palette.mode === "dark"
                                ? `linear-gradient(135deg, ${alpha(
                                    theme.palette.primary.main,
                                    0.14
                                  )} 0%, ${alpha(theme.palette.primary.light, 0.22)} 100%)`
                                : "linear-gradient(135deg, #fbf2ea 0%, #fde8c8 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                              overflow: "hidden",
                              position: "relative",
                            })}
                          >
                            {!pet.imageUrl && (
                              <Box
                                sx={(theme) => ({
                                  position: "absolute",
                                  width: 100,
                                  height: 100,
                                  borderRadius: "50%",
                                  background:
                                    theme.palette.mode === "dark"
                                      ? alpha(theme.palette.primary.main, 0.16)
                                      : "rgba(245,166,35,0.15)",
                                })}
                              />
                            )}

                            {pet.imageUrl ? (
                              <Box
                                component="img"
                                src={pet.imageUrl}
                                alt={pet.name}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Typography
                                sx={(theme) => ({
                                  fontSize: scaleFont(48, settings?.textSize),
                                  fontWeight: 800,
                                  color: theme.palette.primary.main,
                                  lineHeight: 1,
                                  position: "relative",
                                  zIndex: 1,
                                })}
                              >
                                {pet.imageLetter}
                              </Typography>
                            )}
                          </Box>

                          <Stack spacing={0.5} sx={{ mb: 2 }}>
                            <Typography
                              sx={(theme) => ({
                                fontSize: scaleFont(18, settings?.textSize),
                                fontWeight: 800,
                                color: theme.palette.text.primary,
                                lineHeight: 1.2,
                              })}
                            >
                              {pet.name}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={0.8}>
                              <Typography
                                sx={(theme) => ({
                                  fontSize: scaleFont(13, settings?.textSize),
                                  color: theme.palette.text.secondary,
                                  fontWeight: 500,
                                })}
                              >
                                {pet.breed}
                              </Typography>

                              <Box
                                sx={(theme) => ({
                                  width: 3,
                                  height: 3,
                                  borderRadius: "50%",
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? alpha(theme.palette.text.secondary, 0.6)
                                      : "#c9d0da",
                                })}
                              />

                              <Typography
                                sx={(theme) => ({
                                  fontSize: scaleFont(13, settings?.textSize),
                                  color: theme.palette.text.secondary,
                                  fontWeight: 500,
                                })}
                              >
                                {pet.weight}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Button
                            fullWidth
                            startIcon={
                              <VisibilityOutlinedIcon
                                sx={{ fontSize: "18px !important" }}
                              />
                            }
                            onClick={() => navigate(`/animals/${pet.id}`)}
                            sx={{
                              py: 1.2,
                              borderRadius: 2.5,
                              background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: scaleFont(14, settings?.textSize),
                              fontWeight: 700,
                              letterSpacing: "-0.1px",
                              boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                                boxShadow: "0 6px 16px rgba(245,166,35,0.45)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            {t("view")}
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                      fontSize: scaleFont(16, settings?.textSize),
                    })}
                  >
                    {t("noPets")}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};