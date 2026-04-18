import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
    return (
      <Alert severity="error">
        Could not load admin dashboard.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 900,
            color: "#071c42",
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography sx={{ color: "#6b7280", fontSize: 16 }}>
          Manage users, inspect data, and control the app from one place.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
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
            sx={{
              flex: "1 1 220px",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography color="text.secondary">{label}</Typography>
              <Typography sx={{ fontSize: 34, fontWeight: 900, color: "#071c42" }}>
                {value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Card sx={{ borderRadius: 5, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 900,
              color: "#071c42",
              mb: 3,
            }}
          >
            Users
          </Typography>

          <Stack spacing={2.5}>
            {sortedUsers.map((user) => (
              <Box
                key={user.id}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  p: 2.5,
                }}
              >
                <Stack
                  direction={{ xs: "column", lg: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#071c42" }}>
                      {user.fullName}
                    </Typography>

                    <Typography sx={{ color: "#64748b", fontSize: 16, mb: 1.5 }}>
                      {user.email}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={`Role: ${user.role}`} />
                      <Chip
                        label={user.isEmailConfirmed ? "Email confirmed" : "Email not confirmed"}
                        color={user.isEmailConfirmed ? "success" : "default"}
                      />
                      <Chip
                        label={user.isDeleted ? "Deleted" : "Active"}
                        color={user.isDeleted ? "error" : "warning"}
                      />
                    </Stack>
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 800,
                      }}
                    >
                      Manage User
                    </Button>

                    {user.isDeleted ? (
                      <Button
                        variant="outlined"
                        onClick={() => handleRestore(user.id)}
                        sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800 }}
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeactivate(user.id)}
                        sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800 }}
                      >
                        Deactivate
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};