import { apiClient } from "./client";
import { DELETE_DEWORMING_ENDPOINT } from "./endpoints/endpoints";

export const deleteDeworming = async (dewormingId: number) => {
  const { data } = await apiClient.delete(
    `${DELETE_DEWORMING_ENDPOINT}/${dewormingId}`
  );

  return data;
};