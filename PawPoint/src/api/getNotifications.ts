import { apiClient } from "./client";
import { GET_NOTIFICATIONS_ENDPOINT } from "./endpoints/endpoints";

type Params = {
  isRead?: boolean;
  typeId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const getNotifications = async (params: Params = {}) => {
  const { data } = await apiClient.get(GET_NOTIFICATIONS_ENDPOINT, {
    params,
  });

  return data;
};