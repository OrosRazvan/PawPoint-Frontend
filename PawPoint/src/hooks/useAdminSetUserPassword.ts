import { useMutation } from "@tanstack/react-query";
import { adminApi, type AdminSetUserPasswordRequest } from "../api/adminApi";

export const useAdminSetUserPassword = () => {
  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AdminSetUserPasswordRequest;
    }) => adminApi.setUserPassword(userId, payload),
  });
};