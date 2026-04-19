import { useQuery } from "@tanstack/react-query";
import { contactMessagesApi } from "../api/contactMessagesApi";

export const useMyContactMessages = () => {
  return useQuery({
    queryKey: ["my-contact-messages"],
    queryFn: contactMessagesApi.getMine,
    refetchInterval: 5000,
  });
};