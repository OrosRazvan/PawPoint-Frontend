import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { useDeactivateUser } from "../../hooks/useDeactivateUser";
import { useRestoreUser } from "../../hooks/useRestoreUser";
import { useSnackbar } from "notistack";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const dashboardQuery = useAdminDashboard();
  const usersQuery = useAdminUsers();
  const deactivateMutation = useDeactivateUser();
  const restoreMutation = useRestoreUser();

  const stats = dashboardQuery.data;
  const users = usersQuery.data ?? [];

  const loading = dashboardQuery.isLoading || usersQuery.isLoading;

  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [users]);

  const handleDeactivate = async (userId: number) => {
    try {
      await deactivateMutation.mutateAsync(userId);
      enqueueSnackbar("User deactivated.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not deactivate user.", { variant: "error" });
    }
  };

  const handleRestore = async (userId: number) => {
    try {
      await restoreMutation.mutateAsync(userId);
      enqueueSnackbar("User restored.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not restore user.", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (dashboardQuery.isError || usersQuery.isError) {
    return <Alert severity="error">Could not load admin dashboard.</Alert>;
  }

  return (
    <Stack
      spacing={3.5}
      sx={{
        px: { xs: 2, sm: 3, md: 5, lg: 7 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: 28, md: 34 },
            fontWeight: 900,
            color: "#071c42",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography sx={{ color: "#6b7280", fontSize: 16 }}>
          Manage users, inspect data, and control the app from one place.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {[
          ["Total Users", stats?.totalUsers ?? 0],
          ["Active Users", stats?.activeUsers ?? 0],
          ["Deleted Users", stats?.deletedUsers ?? 0],
          ["Animals", stats?.totalAnimals ?? 0],
          ["Appointments", stats?.totalAppointments ?? 0],
          ["Vet Cabinets", stats?.totalVetCabinets ?? 0],
        ].map(([label, value]) => (
          <Card
            key={label}
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid rgba(7,28,66,0.08)",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.10)",
                borderColor: "rgba(7,28,66,0.14)",
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
              <Stack spacing={1}>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 30, md: 36 },
                    fontWeight: 900,
                    color: "#071c42",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid rgba(7,28,66,0.08)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3.25 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 28 },
                  fontWeight: 900,
                  color: "#071c42",
                  lineHeight: 1.15,
                  mb: 0.75,
                }}
              >
                Users
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 14.5,
                }}
              >
                Review user accounts and manage their access.
              </Typography>
            </Box>

            <Divider />

            <Stack spacing={2}>
              {sortedUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    border: "1px solid rgba(7,28,66,0.08)",
                    borderRadius: 4,
                    p: { xs: 2, md: 2.5 },
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
                      borderColor: "rgba(7,28,66,0.14)",
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    justifyContent="space-between"
                    spacing={{ xs: 2, lg: 3 }}
                  >
                    <Stack spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: { xs: 18, md: 21 },
                            fontWeight: 900,
                            color: "#071c42",
                            lineHeight: 1.2,
                            mb: 0.75,
                            wordBreak: "break-word",
                          }}
                        >
                          {user.fullName}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: 15,
                            fontWeight: 500,
                            wordBreak: "break-word",
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        <Chip
                          label={`Role: ${user.role}`}
                          sx={{
                            borderRadius: 2.5,
                            fontWeight: 700,
                            backgroundColor: "rgba(7,28,66,0.06)",
                            color: "#071c42",
                          }}
                        />
                        <Chip
                          label={
                            user.isEmailConfirmed
                              ? "Email confirmed"
                              : "Email not confirmed"
                          }
                          color={user.isEmailConfirmed ? "success" : "default"}
                          sx={{
                            borderRadius: 2.5,
                            fontWeight: 700,
                          }}
                        />
                        <Chip
                          label={user.isDeleted ? "Deleted" : "Active"}
                          color={user.isDeleted ? "error" : "warning"}
                          sx={{
                            borderRadius: 2.5,
                            fontWeight: 700,
                          }}
                        />
                      </Stack>
                    </Stack>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "stretch", sm: "center" }}
                      justifyContent="flex-end"
                      sx={{
                        alignSelf: { xs: "stretch", lg: "center" },
                        minWidth: { lg: 260 },
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 800,
                          px: 2.25,
                          py: 1.1,
                          minWidth: 140,
                          boxShadow: "0 10px 24px rgba(25, 118, 210, 0.22)",
                        }}
                      >
                        Manage User
                      </Button>

                      {user.isDeleted ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleRestore(user.id)}
                          sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 800,
                            px: 2,
                            py: 1.1,
                            minWidth: 120,
                          }}
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeactivate(user.id)}
                          sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 800,
                            px: 2,
                            py: 1.1,
                            minWidth: 120,
                          }}
                        >
                          Deactivate
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};