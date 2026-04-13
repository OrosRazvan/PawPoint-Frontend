import { apiClient } from "./client";
import { GET_USER_PROFILE_ENDPOINT } from "./endpoints/endpoints";

export type UserProfileResponse = {
  email: string;
  fullName: string;
  profilePictureUrl?: string | null;
  phoneNumber?: string | null;
  notificationPreference?: string | null;
};

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await apiClient.get(GET_USER_PROFILE_ENDPOINT);
  return data;
};