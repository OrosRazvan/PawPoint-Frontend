import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contactMessagesApi } from "../api/contactMessagesApi";

export const useAdminReplyContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: number;
      message: string;
    }) => contactMessagesApi.replyAsAdmin(id, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contact-message", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-contact-messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-contact-messages"],
      });
    },
  });
};