import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AssistantMessageBubble from "./AssistantMessageBubble";
import type { ChatMessage, AssistantResponse } from "../types/assistant";
import { useAssistantMessage } from "../../../hooks/useAssistantMessage";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { scaleFont } from "../../../utils/fontScale";
import type { AppTextSize } from "../../../utils/textSize";
import chatbotAvatar from "../../../assets/chatbot/chatbot-avatar.png";

function createMessageId() {
  return crypto.randomUUID();
}

type AssistantChatProps = {
  darkMode?: boolean;
  lightMode?: boolean;
  fontScale?: AppTextSize;
};

export default function AssistantChat({
  darkMode,
  lightMode,
  fontScale,
}: AssistantChatProps) {
  const { t } = useTranslation("assistant");
  const { mutateAsync: askAssistant, isPending } = useAssistantMessage();
  const { data: profile } = useUserProfile();

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: "assistant",
      response: {
        intent: "Greeting",
        replyKey: "assistant.greeting",
        replyParams: {},
        data: null,
        suggestions: [
          { key: "assistant.suggestions.listPets", params: {} },
          { key: "assistant.suggestions.upcomingAppointments", params: {} },
          { key: "assistant.suggestions.healthOverview", params: {} },
          { key: "assistant.suggestions.recommendations", params: {} },
        ],
      },
      createdAt: new Date().toISOString(),
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isPending,
    [input, isPending]
  );

  const scrollMessagesToBottom = () => {
    setTimeout(() => {
      const container = messagesContainerRef.current;

      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const pushAssistantResponse = (response: AssistantResponse) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        role: "assistant",
        response,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || isPending) return;

    pushUserMessage(trimmed);
    setInput("");
    scrollMessagesToBottom();

    try {
      const response = await askAssistant({ message: trimmed });
      pushAssistantResponse(response);
    } catch {
      pushAssistantResponse({
        intent: "Error",
        replyKey: "assistant.errors.generic",
        replyParams: {},
        data: null,
        suggestions: [],
      });
    } finally {
      scrollMessagesToBottom();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => {
        const resolvedMode = darkMode
          ? "dark"
          : lightMode
          ? "light"
          : theme.palette.mode;

        const isDark = resolvedMode === "dark";

        return {
          height: "calc(100vh - 160px)",
          minHeight: 620,
          display: "flex",
          flexDirection: "column",
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark
            ? "0 10px 24px rgba(0,0,0,0.28)"
            : "0 10px 24px rgba(0,0,0,0.05)",
        };
      }}
    >
      <Box
        sx={(theme) => ({
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(180deg, ${alpha(
                  theme.palette.primary.dark,
                  0.28
                )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
              : `linear-gradient(180deg, ${alpha(
                  theme.palette.primary.light,
                  0.24
                )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
        })}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontSize: scaleFont(34, fontScale),
          })}
        >
          {t("assistant.pageTitle")}
        </Typography>

        <Typography
          variant="body1"
          sx={(theme) => ({
            mt: 1,
            color: theme.palette.text.secondary,
            fontSize: scaleFont(16, fontScale),
          })}
        >
          {t("assistant.pageSubtitle")}
        </Typography>
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          py: 3,
        }}
      >
        <Stack spacing={2}>
          {messages.map((message) => (
            <AssistantMessageBubble
              key={message.id}
              message={message}
              onSuggestionClick={sendMessage}
              darkMode={darkMode}
              lightMode={lightMode}
              fontScale={fontScale}
              userProfilePictureUrl={profile?.profilePictureUrl ?? undefined}
              userFullName={profile?.fullName}
            />
          ))}

          {isPending ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Avatar
                src={chatbotAvatar}
                sx={{
                  width: 56,
                  height: 56,
                  mt: 0.25,
                  flexShrink: 0,
                  border: "1px solid rgba(245,166,35,0.28)",
                  boxShadow: "0 8px 22px rgba(245,166,35,0.16)",
                  backgroundColor: "#fff",
                }}
              />

              <Paper
                elevation={0}
                sx={(theme) => ({
                  px: 2,
                  py: 1.3,
                  borderRadius: 4,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.04)
                      : theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                })}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={18} color="primary" />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: scaleFont(14, fontScale) }}
                  >
                    {t("assistant.loading")}
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          ) : null}
        </Stack>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={(theme) => ({
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("assistant.inputPlaceholder")}
            variant="outlined"
            size="medium"
            sx={(theme) => ({
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.03)
                    : theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontSize: scaleFont(15, fontScale),
                "& fieldset": {
                  borderColor: theme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputBase-input": {
                fontSize: scaleFont(15, fontScale),
              },
              "& .MuiInputBase-input::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            })}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={!canSend}
            sx={{
              minWidth: 140,
              borderRadius: 4,
              fontWeight: 700,
              boxShadow: "none",
              fontSize: scaleFont(15, fontScale),
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {t("assistant.send")}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}