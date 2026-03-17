import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { LoginFormValues } from "../types/loginSchema";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const payload = {
        email: values.email.toLowerCase().trim(),
        password: values.password,
      };

      return authApi.login(payload);
    },
  });
};