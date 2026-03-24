import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      return authApi.verifyEmail({ token });
    },
  });
};