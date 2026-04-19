import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAdminContactMessageDetails } from "../../hooks/useAdminContactMessageDetails";
import { useAdminReplyContactMessage } from "../../hooks/useAdminReplyContactMessage";

export const AdminContactMessageDetails = () => {
  const { id } = useParams();
  const messageId = Number(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const detailsQuery = useAdminContactMessageDetails(messageId);
  const replyMutation = useAdminReplyContactMessage();

  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) {
      enqueueSnackbar("Reply message is required.", { variant: "error" });
      return;
    }

    try {
      await replyMutation.mutateAsync({
        id: messageId,
        message: replyText.trim(),
      });

      setReplyText("");
      enqueueSnackbar("Reply sent.", { variant: "success" });
    } catch {
      enqueueSnackbar("Could not send reply.", { variant: "error" });
    }
  };

  if (detailsQuery.isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "50vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (detailsQuery.isError || !detailsQuery.data) {
    return <Alert severity="error">Could not load message details.</Alert>;
  }

  const message = detailsQuery.data;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 900, color: "#071c42" }}>
            Contact Message
          </Typography>
          <Typography sx={{ color: "#64748b" }}>
            Read the thread and reply to the user.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/admin/contact-messages")}
          sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800 }}
        >
          Back
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 5 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#071c42" }}>
              {message.title}
            </Typography>

            <Typography sx={{ color: "#64748b" }}>
              {message.userFullName} · {message.email}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip label={`#${message.id}`} />
              <Chip label={message.status} color="primary" />
            </Stack>

            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {message.description}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 5 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#071c42" }}>
              Replies
            </Typography>

            {message.replies.length === 0 ? (
              <Typography sx={{ color: "#64748b" }}>
                No replies yet.
              </Typography>
            ) : (
              message.replies.map((reply) => (
                <Card key={reply.id} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: 800 }}>
                        {reply.senderName} · {reply.senderType}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {reply.message}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 5 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#071c42" }}>
              Reply as Admin
            </Typography>

            <TextField
              label="Reply message"
              multiline
              minRows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleReply}
              disabled={replyMutation.isPending}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Send Reply
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};