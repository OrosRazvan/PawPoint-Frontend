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
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 32, fontWeight: 900, color: "#071c42" }}>
          Contact Messages
        </Typography>
        <Typography sx={{ color: "#64748b" }}>
          Review all contact requests and reply to users.
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {messages.map((message) => (
          <Card key={message.id} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#071c42" }}>
                    {message.title}
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    {message.userFullName}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Chip label={`#${message.id}`} />
                    <Chip label={message.status} color="primary" />
                    <Chip label={`${message.replies.length} replies`} />
                  </Stack>
                </Box>

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ alignSelf: { xs: "stretch", lg: "center" } }}
                    >
                    {(message.status === "Open" || message.replies.length === 0) && (
                        <Box
                        sx={(theme) => ({
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.error.main,
                            flexShrink: 0,
                        })}
                        />
                    )}

                    <Button
                        variant="contained"
                        onClick={() => navigate(`/admin/contact-messages/${message.id}`)}
                        sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 800,
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