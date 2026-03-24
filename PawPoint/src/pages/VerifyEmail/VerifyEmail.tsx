import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", {
        replace: true,
        state: { verifyError: true },
      });
      return;
    }

    verifyEmailMutation.mutate(token, {
      onSuccess: () => {
        navigate("/login", {
          replace: true,
          state: { emailVerified: true },
        });
      },
      onError: () => {
        navigate("/login", {
          replace: true,
          state: { verifyError: true },
        });
      },
    });
  }, [navigate, searchParams, verifyEmailMutation]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f4ef",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography variant="h6">Verifying email...</Typography>
      </Stack>
    </Box>
  );
};