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
import { useNavigate } from "react-router-dom";
import { useAdminContactMessages } from "../../hooks/useAdminContactMessages";

export const AdminContactMessages = () => {
  const navigate = useNavigate();
  const messagesQuery = useAdminContactMessages();

  if (messagesQuery.isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "50vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (messagesQuery.isError) {
    return <Alert severity="error">Could not load contact messages.</Alert>;
  }

  const messages = messagesQuery.data ?? [];

  return (
    <Stack
      spacing={4}
      sx={{
        px: { xs: 2, sm: 3, md: 5, lg: 7 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={1}>
        <Typography
          sx={{
            fontSize: { xs: 28, md: 34 },
            fontWeight: 900,
            color: "#071c42",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Contact Messages
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontSize: 15,
          }}
        >
          Review all contact requests and reply to users.
        </Typography>
      </Stack>

      <Stack spacing={2.25}>
        {messages.map((message) => (
          <Card
            key={message.id}
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
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                spacing={{ xs: 2.5, lg: 3 }}
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
                      {message.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: 14.5,
                        fontWeight: 500,
                      }}
                    >
                      {message.userFullName}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Chip
                      label={`#${message.id}`}
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        backgroundColor: "rgba(7,28,66,0.06)",
                        color: "#071c42",
                      }}
                    />

                    <Chip
                      label={message.status}
                      color="primary"
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                      }}
                    />

                    <Chip
                      label={`${message.replies.length} replies`}
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        backgroundColor: "rgba(100,116,139,0.10)",
                        color: "#475569",
                      }}
                    />
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent={{ xs: "space-between", sm: "flex-end" }}
                  sx={{
                    alignSelf: { xs: "stretch", lg: "center" },
                    minWidth: { lg: 220 },
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    {(message.status === "Open" ||
                      message.replies.length === 0) && (
                      <Box
                        sx={(theme) => ({
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: theme.palette.error.main,
                          flexShrink: 0,
                          boxShadow: `0 0 0 4px ${theme.palette.error.main}22`,
                        })}
                      />
                    )}
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/admin/contact-messages/${message.id}`)
                    }
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 800,
                      px: 2.25,
                      py: 1.2,
                      minWidth: 150,
                      boxShadow: "0 10px 24px rgba(25, 118, 210, 0.22)",
                    }}
                  >
                    Open Message
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};