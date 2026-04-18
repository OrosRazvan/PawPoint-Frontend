import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type AdminUpdateUserProfileRequest } from "../api/adminApi";

export const useAdminUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AdminUpdateUserProfileRequest;
    }) => adminApi.updateUserProfile(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user-details", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};