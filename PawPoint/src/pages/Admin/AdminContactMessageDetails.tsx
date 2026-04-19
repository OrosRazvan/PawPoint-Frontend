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
    <Stack
      spacing={3}
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
              color: "#071c42",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Contact Message
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 15,
              mt: 0.5,
            }}
          >
            Read the thread and reply to the user.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/admin/contact-messages")}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            px: 2.25,
            py: 1,
          }}
        >
          Back
        </Button>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid rgba(7,28,66,0.08)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3.25 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 900,
                  color: "#071c42",
                  lineHeight: 1.15,
                  wordBreak: "break-word",
                }}
              >
                {message.title}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 15,
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                {message.userFullName} · {message.email}
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
              </Stack>
            </Stack>

            <Divider />

            <Box
              sx={{
                borderRadius: 4,
                backgroundColor: "rgba(7,28,66,0.02)",
                border: "1px solid rgba(7,28,66,0.06)",
                px: { xs: 1.75, md: 2.25 },
                py: { xs: 1.75, md: 2 },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  color: "#0f172a",
                  lineHeight: 1.75,
                  fontSize: 15.5,
                }}
              >
                {message.description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid rgba(7,28,66,0.08)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3.25 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 21, md: 24 },
                  fontWeight: 900,
                  color: "#071c42",
                  lineHeight: 1.2,
                }}
              >
                Replies
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 14,
                  mt: 0.5,
                }}
              >
                Conversation history for this contact message.
              </Typography>
            </Box>

            {message.replies.length === 0 ? (
              <Box
                sx={{
                  borderRadius: 4,
                  border: "1px dashed rgba(100,116,139,0.35)",
                  backgroundColor: "rgba(100,116,139,0.04)",
                  px: 2,
                  py: 3,
                }}
              >
                <Typography sx={{ color: "#64748b", fontWeight: 500 }}>
                  No replies yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {message.replies.map((reply) => (
                  <Card
                    key={reply.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 4,
                      borderColor: "rgba(7,28,66,0.10)",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 2.25 } }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          spacing={1}
                        >
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: "#071c42",
                              fontSize: 15.5,
                            }}
                          >
                            {reply.senderName} · {reply.senderType}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#64748b",
                              fontSize: 13,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {new Date(reply.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>

                        <Typography
                          sx={{
                            whiteSpace: "pre-wrap",
                            color: "#0f172a",
                            lineHeight: 1.7,
                            fontSize: 15,
                          }}
                        >
                          {reply.message}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          border: "1px solid rgba(7,28,66,0.08)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3.25 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 21, md: 24 },
                  fontWeight: 900,
                  color: "#071c42",
                  lineHeight: 1.2,
                }}
              >
                Reply as Admin
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 14,
                  mt: 0.5,
                }}
              >
                Write a response and send it to the user.
              </Typography>
            </Box>

            <TextField
              label="Reply message"
              multiline
              minRows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#fff",
                },
              }}
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
                px: 2.5,
                py: 1.2,
                minWidth: 140,
                boxShadow: "0 10px 24px rgba(25, 118, 210, 0.22)",
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