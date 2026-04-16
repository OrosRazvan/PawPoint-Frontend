import { useMutation } from "@tanstack/react-query";
import {
  authApi,
  type ForgotPasswordRequest,
} from "../api/authApi";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authApi.forgotPassword(payload),
  });
};