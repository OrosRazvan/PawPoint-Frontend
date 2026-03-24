import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { RegisterFormValues } from "../types/registerSchema";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const payload = {
        fullName: values.fullname.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      return authApi.register(payload);
    },
  });
};