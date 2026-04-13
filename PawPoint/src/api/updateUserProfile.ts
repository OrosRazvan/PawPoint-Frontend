import { apiClient } from "./client";
import { UPDATE_USER_PROFILE_ENDPOINT } from "./endpoints/endpoints";

export type UpdateUserProfilePayload = {
  fullName?: string;
  phoneNumber?: string | null;
  profilePicture?: File | null;
};

export const updateUserProfile = async (
  payload: UpdateUserProfilePayload
) => {
  const formData = new FormData();

  if (payload.fullName !== undefined) {
    formData.append("FullName", payload.fullName);
  }

  if (payload.phoneNumber !== undefined) {
    formData.append("PhoneNumber", payload.phoneNumber ?? "");
  }

  if (payload.profilePicture) {
    formData.append("ProfilePicture", payload.profilePicture);
  }

  const { data } = await apiClient.put(UPDATE_USER_PROFILE_ENDPOINT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};