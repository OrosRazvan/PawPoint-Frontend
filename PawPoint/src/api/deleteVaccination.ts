import { apiClient } from "./client";
import { DELETE_VACCINATION_ENDPOINT } from "./endpoints/endpoints";

export const deleteVaccination = async (vaccinationId: number) => {
  const { data } = await apiClient.delete(
    `${DELETE_VACCINATION_ENDPOINT}/${vaccinationId}`
  );

  return data;
};