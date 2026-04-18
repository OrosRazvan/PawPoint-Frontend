import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";

export const useRestoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => adminApi.restoreUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-details", userId] });
    },
  });
};