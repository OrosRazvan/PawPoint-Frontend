import { apiClient } from "./client";
import { GET_VET_CABINETS_ENDPOINT } from "./endpoints/endpoints";
import type { VetCabinetDto } from "../pages/Vaccinations/types/vaccination";

export const getVetCabinets = async () => {
  const { data } = await apiClient.get<VetCabinetDto[]>(GET_VET_CABINETS_ENDPOINT);
  return data;
};