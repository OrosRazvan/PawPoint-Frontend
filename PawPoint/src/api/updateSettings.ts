import { apiClient } from "./client";
import { UPDATE_SETTINGS_ENDPOINT } from "./endpoints/endpoints";
import type { UpdateUserSettingsDto, UserSettingsDto } from "../pages/Settings/types/settings";

export const updateSettings = async (
  payload: UpdateUserSettingsDto
): Promise<UserSettingsDto> => {
  const { data } = await apiClient.put(UPDATE_SETTINGS_ENDPOINT, payload);
  return data;
};