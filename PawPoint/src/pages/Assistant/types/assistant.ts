export type AssistantRequest = {
  message: string;
};

export type AssistantSuggestion = {
  key: string;
  params: Record<string, string>;
};

export type AssistantResponse = {
  intent: string;
  replyKey: string;
  replyParams: Record<string, string>;
  data?: unknown;
  suggestions: AssistantSuggestion[];
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text?: string;
  response?: AssistantResponse;
  createdAt: string;
};