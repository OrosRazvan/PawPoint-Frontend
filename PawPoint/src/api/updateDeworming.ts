import { apiClient } from "./client";
import { UPDATE_DEWORMING_ENDPOINT } from "./endpoints/endpoints";
import type { DewormingDto, DewormingType } from "../pages/Deworming/types/deworming";

export type UpdateDewormingRequest = {
  type?: DewormingType;
  intervalDays?: number;
  notes?: string;
};

export const updateDeworming = async (
  dewormingId: number,
  payload: UpdateDewormingRequest
) => {
  const { data } = await apiClient.put<DewormingDto>(
    `${UPDATE_DEWORMING_ENDPOINT}/${dewormingId}`,
    payload
  );

  return data;
};