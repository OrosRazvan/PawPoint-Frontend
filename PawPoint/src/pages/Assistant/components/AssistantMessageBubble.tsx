import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { AssistantResponse, AssistantSuggestion, ChatMessage } from "../types/assistant";
import { scaleFont } from "../../../utils/fontScale";
import type { AppTextSize } from "../../../utils/textSize";

type Props = {
  message: ChatMessage;
  onSuggestionClick?: (text: string) => void;
  darkMode?: boolean;
  lightMode?: boolean;
  fontScale?: AppTextSize;
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

export default function AssistantMessageBubble({
  message,
  onSuggestionClick,
  darkMode,
  lightMode,
  fontScale,
}: Props) {
  const { t } = useTranslation("assistant");
  const isUser = message.role === "user";

  const text = isUser
    ? message.text ?? ""
    : message.response
      ? renderAssistantText(message.response, t)
      : "";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={(theme) => {
          const resolvedMode = darkMode ? "dark" : lightMode ? "light" : theme.palette.mode;
          const isDark = resolvedMode === "dark";

          return {
            maxWidth: "80%",
            px: 2,
            py: 1.5,
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
            lineHeight: 1.7,
            fontSize: scaleFont(15, fontScale),
          }}
        >
          {text}
        </Typography>

        {!isUser && message.response?.suggestions?.length ? (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ mt: 2 }}
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
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.03)
                        : alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: scaleFont(13, fontScale),
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.06)
                          : alpha(theme.palette.primary.main, 0.14),
                    },
                  })}
                />
              );
            })}
          </Stack>
        ) : null}
      </Paper>
    </Box>
  );
}