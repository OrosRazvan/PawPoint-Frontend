import { useQuery } from "@tanstack/react-query";
import { contactMessagesApi } from "../api/contactMessagesApi";

export const useAdminContactMessages = (enabled = true) => {
  return useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: contactMessagesApi.getAdminAll,
    refetchInterval: 5000,
    enabled,
  });
};