import { useMutation } from "@tanstack/react-query";
import {
  authApi,
  type ResetPasswordRequest,
} from "../api/authApi";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authApi.resetPassword(payload),
  });
};