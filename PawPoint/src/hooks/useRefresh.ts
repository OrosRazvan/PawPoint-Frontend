import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export const useRefresh = () => {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      return authApi.refresh({ refreshToken });
    },
  });
};