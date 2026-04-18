import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export const useAdminUserDetails = (userId: number) => {
  return useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: () => adminApi.getUserDetails(userId),
    enabled: !!userId,
  });
};