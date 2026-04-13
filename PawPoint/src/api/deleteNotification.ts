import { apiClient } from "./client";
import { DELETE_NOTIFICATION_ENDPOINT } from "./endpoints/endpoints";

export const deleteNotification = async (notificationId: number) => {
  const { data } = await apiClient.delete(
    `${DELETE_NOTIFICATION_ENDPOINT}/${notificationId}`
  );

  return data;
};