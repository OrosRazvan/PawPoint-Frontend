import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  contactMessagesApi,
  type CreateContactMessageRequest,
} from "../api/contactMessagesApi";

export const useCreateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactMessageRequest) =>
      contactMessagesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    },
  });
};