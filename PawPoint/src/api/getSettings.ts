import { apiClient } from "./client";
import { GET_SETTINGS_ENDPOINT } from "./endpoints/endpoints";
import type { UserSettingsDto } from "../pages/Settings/types/settings";

export const getSettings = async (): Promise<UserSettingsDto> => {
  const { data } = await apiClient.get(GET_SETTINGS_ENDPOINT);
  return data;
};