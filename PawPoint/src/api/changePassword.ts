import { apiClient } from "./client";
import { CHANGE_PASSWORD_ENDPOINT } from "./endpoints/endpoints";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await apiClient.put(CHANGE_PASSWORD_ENDPOINT, payload);
  return data;
};