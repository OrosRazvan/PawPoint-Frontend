import { apiClient } from "./client";
import { ASSISTANT_MESSAGE_ENDPOINT } from "./endpoints/endpoints";
import type {
  AssistantRequest,
  AssistantResponse
} from "../pages/Assistant/types/assistant";

export const sendAssistantMessage = async (
  payload: AssistantRequest
) => {
  const { data } = await apiClient.post<AssistantResponse>(
    ASSISTANT_MESSAGE_ENDPOINT,
    payload
  );

  return data;
};