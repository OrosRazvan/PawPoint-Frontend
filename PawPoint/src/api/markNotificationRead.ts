import { apiClient } from "./client";
import { MARK_NOTIFICATION_READ_ENDPOINT } from "./endpoints/endpoints";

export const markNotificationRead = async (notificationId: number) => {
  const { data } = await apiClient.put(
    `${MARK_NOTIFICATION_READ_ENDPOINT}/${notificationId}/read`
  );

  return data;
};