import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useUpdateUserProfile } from "../../hooks/useUpdateUserProfile";
import { useAppointments } from "../../hooks/useAppointments";
import { useVaccinations } from "../../hooks/useVaccinations";
import { useDewormings } from "../../hooks/useDewormings";
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

const pageBg = "#f8f4ef";

const cardSx = {
  borderRadius: 4,
  backgroundColor: "#fffdfb",
  border: "1px solid #ebe3da",
  boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
};

const formatActivityDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getInitial = (name?: string | null) => {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

export const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } =
    useUserProfile();

  const { data: appointments = [] } = useAppointments();
  const { data: vaccinations = [] } = useVaccinations();
  const { data: dewormings = [] } = useDewormings();

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const safeProfile = profile ?? {
    fullName: "",
    email: "",
    phoneNumber: "",
    profilePictureUrl: "",
  };

  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  const handleLogout = () => {
    clearTokens();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  useMemo(() => {
    setFullName(safeProfile.fullName ?? "");
    setPhoneNumber(safeProfile.phoneNumber ?? "");
  }, [safeProfile.fullName, safeProfile.phoneNumber]);

  const activityItems = useMemo<ActivityItem[]>(() => {
    const appointmentItems: ActivityItem[] = appointments.map((item: any) => ({
      id: `appointment-${item.id}`,
      type: "appointment",
      title: `${item.serviceType ?? "Consult"} for ${item.animalName ?? "Pet"}`,
      dateValue: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
      clinic: item.vetCabinetName ?? "Veterinary Clinic",
    }));

    const vaccinationItems: ActivityItem[] = vaccinations.map((item: any) => ({
      id: `vaccination-${item.id}`,
      type: "vaccination",
      title: `${item.vaccineName ?? "Vaccination"} for ${item.animalName ?? "Pet"}`,
      dateValue:
        item.dateUtc ??
        item.scheduledAtUtc ??
        item.startTimeUtc ??
        item.date ??
        "",
      clinic: item.vetCabinetName ?? "Veterinary Clinic",
    }));

    const dewormingItems: ActivityItem[] = dewormings.map((item: any) => ({
      id: `deworming-${item.id}`,
      type: "deworming",
      title: `${item.productName ?? item.type ?? "Deworming"} for ${
        item.animalName ?? "Pet"
      }`,
      dateValue:
        item.dateUtc ??
        item.scheduledAtUtc ??
        item.startTimeUtc ??
        item.date ??
        "",
      clinic: item.vetCabinetName ?? "Veterinary Clinic",
    }));

    return [...appointmentItems, ...vaccinationItems, ...dewormingItems]
      .sort((a, b) => {
        const aTime = new Date(a.dateValue).getTime();
        const bTime = new Date(b.dateValue).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [appointments, vaccinations, dewormings]);

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

  if (isProfileLoading) {
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

  if (isProfileError) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: pageBg, p: 4 }}>
        <Typography color="error">Failed to load profile.</Typography>
      </Box>
    );
  }

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
            lineHeight: 1.1,
          }}
        >
          {t("title")}
        </Typography>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          <Box
            sx={{
              ...cardSx,
              flex: { lg: "0 0 32%" },
              p: 4,
            }}
          >
            <Stack spacing={3}>
              <Stack alignItems="center" spacing={2}>
                {safeProfile.profilePictureUrl ? (
                  <Avatar
                    src={safeProfile.profilePictureUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 40,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 40,
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, #5f86ff 0%, #8b2cff 100%)",
                    }}
                  >
                    {getInitial(safeProfile.fullName)}
                  </Avatar>
                )}

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#071c42",
                    }}
                  >
                    {safeProfile.fullName}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 16,
                      color: "#5f7087",
                    }}
                  >
                    {safeProfile.email}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ borderTop: "1px solid #ebe3da", pt: 3 }}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#071c42",
                    mb: 3,
                  }}
                >
                  {t("accountInformation")}
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#425466",
                        mb: 1,
                      }}
                    >
                      {t("fullName")}
                    </Typography>

                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <TextField
                        fullWidth
                        value={fullName}
                        disabled={!isEditingName}
                        onChange={(e) => setFullName(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "#fff",
                          },
                        }}
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
                          backgroundColor: "#edf4ff",
                          color: "#2563ff",
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#425466",
                        mb: 1,
                      }}
                    >
                      {t("email")}
                    </Typography>

                    <TextField
                      fullWidth
                      value={safeProfile.email ?? ""}
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2.5,
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#425466",
                        mb: 1,
                      }}
                    >
                      {t("phone")}
                    </Typography>

                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <TextField
                        fullWidth
                        value={phoneNumber}
                        disabled={!isEditingPhone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "#fff",
                          },
                        }}
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
                          backgroundColor: "#edf4ff",
                          color: "#2563ff",
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Button
                    onClick={() => navigate("/change-password")}
                    sx={{
                        mt: 1,
                        py: 1.7,
                        borderRadius: 2.5,
                        backgroundColor: "#efefef",
                        color: "#071c42",
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 700,
                    }}
                    >
                    {t("changePassword")}
                    </Button>

                  <Button
                    startIcon={<LogoutOutlinedIcon />}
                    onClick={handleLogout}
                    sx={{
                        py: 1.7,
                        borderRadius: 2.5,
                        backgroundColor: "#fde8e8",
                        color: "#ff6b63",
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        "&:hover": {
                        backgroundColor: "#fbdede",
                        },
                    }}
                    >
                    {t("logout")}
                    </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              ...cardSx,
              flex: 1,
              p: 4,
            }}
          >
            <Stack spacing={3}>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#071c42",
                }}
              >
                {t("recentActivity")}
              </Typography>

              <Stack spacing={2.5}>
                {activityItems.map((item) => {
                  const icon =
                    item.type === "appointment" ? (
                      <CalendarMonthRoundedIcon sx={{ color: "#9b4dff" }} />
                    ) : item.type === "vaccination" ? (
                      <VaccinesRoundedIcon sx={{ color: "#2563ff" }} />
                    ) : (
                      <BugReportRoundedIcon sx={{ color: "#16a34a" }} />
                    );

                  const chipLabel =
                    item.type === "appointment"
                      ? t("appointment")
                      : item.type === "vaccination"
                      ? t("vaccination")
                      : t("deworming");

                  const iconBg =
                    item.type === "appointment"
                      ? "#f0e4ff"
                      : item.type === "vaccination"
                      ? "#e7f0ff"
                      : "#def7e6";

                  return (
                    <Box
                      key={item.id}
                      sx={{
                        border: "1px solid #ebe3da",
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        px: 2.5,
                        py: 2.5,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 54,
                              height: 54,
                              borderRadius: 2.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: iconBg,
                              flexShrink: 0,
                            }}
                          >
                            {icon}
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: 18,
                                fontWeight: 800,
                                color: "#071c42",
                              }}
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 1,
                                fontSize: 15,
                                color: "#5f7087",
                              }}
                            >
                              {formatActivityDate(item.dateValue)}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.6,
                                fontSize: 15,
                                color: "#425466",
                              }}
                            >
                              at {t("atClinic", { clinic: item.clinic })}
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={chipLabel}
                          sx={{
                            borderRadius: 999,
                            backgroundColor: "#f2f4f7",
                            color: "#425466",
                            fontSize: 13,
                          }}
                        />
                      </Stack>
                    </Box>
                  );
                })}

                {activityItems.length === 0 && (
                  <Typography sx={{ color: "#667085" }}>
                    {t("noRecentActivity")}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};