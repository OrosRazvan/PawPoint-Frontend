import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { useMyContactMessages } from "../../hooks/useMyContactMessages";

export const MyContactMessages = () => {
  const { t } = useTranslation("contact");
  const messagesQuery = useMyContactMessages();

  if (messagesQuery.isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "40vh" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (messagesQuery.isError) {
    return <Alert severity="error">{t("loadFailed")}</Alert>;
  }

  const messages = messagesQuery.data ?? [];

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 32, fontWeight: 900, color: "#071c42" }}>
          {t("myMessages")}
        </Typography>
        <Typography sx={{ color: "#64748b" }}>
          {t("myMessagesSubtitle")}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {messages.map((message) => (
          <Accordion key={message.id} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 900, color: "#071c42" }}>
                  {message.title}
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                  {message.email}
                </Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Card variant="outlined" sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={`#${message.id}`} />
                      <Chip label={message.status} color="primary" />
                    </Stack>

                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {message.description}
                    </Typography>

                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: 800 }}>
                        {t("replies")}
                      </Typography>

                      {message.replies.length === 0 ? (
                        <Typography sx={{ color: "#64748b" }}>
                          {t("noReplies")}
                        </Typography>
                      ) : (
                        message.replies.map((reply) => (
                          <Card
                            key={reply.id}
                            variant="outlined"
                            sx={{ borderRadius: 3 }}
                          >
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
                  </Stack>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
};