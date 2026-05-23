import { apiClient } from "./client";
import { CREATE_DEWORMING_ENDPOINT } from "./endpoints/endpoints";
import type { DewormingDto, DewormingType } from "../pages/Deworming/types/deworming";

export type CreateDewormingRequest = {
  animalId: number;
  type: DewormingType;
  vetCabinetId: number;
  vetTimeSlotId: number;
  notes?: string;
};

export const createDeworming = async (payload: CreateDewormingRequest) => {
  const { data } = await apiClient.post<DewormingDto>(
    CREATE_DEWORMING_ENDPOINT,
    payload
  );

  return data;
};