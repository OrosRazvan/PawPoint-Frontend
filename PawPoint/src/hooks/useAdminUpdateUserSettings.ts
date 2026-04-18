import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type AdminUpdateUserSettingsRequest } from "../api/adminApi";

export const useAdminUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AdminUpdateUserSettingsRequest;
    }) => adminApi.updateUserSettings(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-user-details", variables.userId],
      });
    },
  });
};