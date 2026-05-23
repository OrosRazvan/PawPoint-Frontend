import { apiClient } from "./client";
import { GET_VACCINATION_VET_CABINETS_ENDPOINT } from "./endpoints/endpoints";

export const getVaccinationVetCabinets = async () => {
  const { data } = await apiClient.get(
    GET_VACCINATION_VET_CABINETS_ENDPOINT
  );

  return data;
};