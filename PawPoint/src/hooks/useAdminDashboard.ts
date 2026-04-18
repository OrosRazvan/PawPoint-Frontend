import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.getDashboard,
  });
};