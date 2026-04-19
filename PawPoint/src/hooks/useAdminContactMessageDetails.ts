import { useQuery } from "@tanstack/react-query";
import { contactMessagesApi } from "../api/contactMessagesApi";

export const useAdminContactMessageDetails = (id: number) => {
  return useQuery({
    queryKey: ["admin-contact-message", id],
    queryFn: () => contactMessagesApi.getAdminById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
};