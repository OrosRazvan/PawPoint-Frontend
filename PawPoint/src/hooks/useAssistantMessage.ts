import { useMutation } from "@tanstack/react-query";
import { sendAssistantMessage } from "../api/assistantApi";
import type { AssistantRequest, AssistantResponse } from "../pages/Assistant/types/assistant";

export const useAssistantMessage = () => {
  return useMutation<AssistantResponse, Error, AssistantRequest>({
    mutationFn: sendAssistantMessage,
  });
};