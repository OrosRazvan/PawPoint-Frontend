import { useMutation } from "@tanstack/react-query";
import { changePassword, type ChangePasswordPayload } from "../api/changePassword";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
};