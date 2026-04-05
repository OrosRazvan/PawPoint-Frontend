import { apiClient } from "./client";
import { GET_DEWORMING_VET_CABINETS_ENDPOINT } from "./endpoints/endpoints";
import type { VetCabinetDto } from "../pages/Deworming/types/deworming";

export const getDewormingVetCabinets = async () => {
  const { data } = await apiClient.get<VetCabinetDto[]>(
    GET_DEWORMING_VET_CABINETS_ENDPOINT
  );
  return data;
};