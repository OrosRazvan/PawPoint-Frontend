import {
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type {
  AssistantResponse,
  AssistantSuggestion,
  ChatMessage,
} from "../types/assistant";
import { scaleFont } from "../../../utils/fontScale";
import type { AppTextSize } from "../../../utils/textSize";
import chatbotAvatar from "../../../assets/chatbot/chatbot-avatar.png";

type Props = {
  message: ChatMessage;
  onSuggestionClick?: (text: string) => void;
  darkMode?: boolean;
  lightMode?: boolean;
  fontScale?: AppTextSize;
  userProfilePictureUrl?: string;
  userFullName?: string;
};

function parseCompositeItems(value?: string) {
  if (!value) return [];

  return value
    .split("||")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [key, ...paramParts] = item.split("|");
      const params: Record<string, string> = {};

      for (const part of paramParts) {
        const [paramKey, ...paramValueParts] = part.split("=");
        params[paramKey] = paramValueParts.join("=");
      }

      return { key, params };
    });
}

function renderAssistantText(
  response: AssistantResponse,
  t: (key: string, params?: Record<string, string>) => string
) {
  if (response.replyKey === "assistant.petOverview.composed") {
    const segments = parseCompositeItems(response.replyParams?.segments);
    return segments.map((segment) => t(segment.key, segment.params)).join(" ");
  }

  if (response.replyKey === "assistant.recommendations.summary") {
    const items = parseCompositeItems(response.replyParams?.items);
    return items.map((item) => t(item.key, item.params)).join(" ");
  }

  return t(response.replyKey, response.replyParams);
}

function resolveSuggestionText(
  suggestion: AssistantSuggestion,
  t: (key: string, params?: Record<string, string>) => string
) {
  return t(suggestion.key, suggestion.params);
}

function getInitial(name?: string) {
  if (!name?.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
}

function formatAssistantDisplayText(text: string) {
  return text
    .replaceAll("Vaccinări due:", "Vaccinări scadente:\n")
    .replaceAll("Deparazitări due:", "\nDeparazitări scadente:\n")
    .replaceAll("Vaccinations due:", "Vaccinări scadente:\n")
    .replaceAll("Dewormings due:", "\nDeparazitări scadente:\n")
    .replace(/Rex - /g, "• Rex — ")
    .replace(/; /g, "\n")
    .replace(/\.\s*Deparazitări scadente:/g, "\n\nDeparazitări scadente:");
}

export default function AssistantMessageBubble({
  message,
  onSuggestionClick,
  darkMode,
  lightMode,
  fontScale,
  userProfilePictureUrl,
  userFullName,
}: Props) {
  const { t } = useTranslation("assistant");
  const isUser = message.role === "user";

  const text = isUser
    ? message.text ?? ""
    : message.response
    ? renderAssistantText(message.response, t)
    : "";

  const displayText = isUser ? text : formatAssistantDisplayText(text);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-start",
        gap: 1.6,
      }}
    >
      {!isUser && (
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
      )}

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
            width: "fit-content",
            maxWidth: isUser ? "70%" : "72%",
            px: 2,
            py: 1.3,
            borderRadius: 4,
            backgroundColor: isUser
              ? theme.palette.primary.main
              : isDark
              ? alpha(theme.palette.common.white, 0.04)
              : theme.palette.background.paper,
            color: isUser
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            border: isUser ? "none" : `1px solid ${theme.palette.divider}`,
          };
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            fontSize: scaleFont(15, fontScale),
          }}
        >
          {displayText}
        </Typography>

        {!isUser && message.response?.suggestions?.length ? (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 1.25 }}
          >
            {message.response.suggestions.map((suggestion, index) => {
              const label = resolveSuggestionText(suggestion, t);

              return (
                <Chip
                  key={`${suggestion.key}-${index}`}
                  label={label}
                  onClick={() => onSuggestionClick?.(label)}
                  clickable
                  sx={(theme) => ({
                    px: 0.5,
                    borderRadius: 999,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.04)
                        : alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: scaleFont(13, fontScale),
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.08)
                          : alpha(theme.palette.primary.main, 0.14),
                    },
                  })}
                />
              );
            })}
          </Stack>
        ) : null}
      </Paper>

      {isUser && (
        <Avatar
          src={userProfilePictureUrl || undefined}
          sx={(theme) => ({
            width: 44,
            height: 44,
            mt: 0.25,
            fontSize: scaleFont(16, fontScale),
            fontWeight: 800,
            background: userProfilePictureUrl
              ? undefined
              : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            color: "#ffffff",
            flexShrink: 0,
          })}
        >
          {!userProfilePictureUrl ? getInitial(userFullName) : null}
        </Avatar>
      )}
    </Box>
  );
}