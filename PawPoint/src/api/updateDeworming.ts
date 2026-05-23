import { apiClient } from "./client";
import { UPDATE_DEWORMING_ENDPOINT } from "./endpoints/endpoints";

import type {
  DewormingDto,
  DewormingTypeEnum,
} from "../pages/Deworming/types/deworming";

export type UpdateDewormingRequest = {
  animalId?: number;
  type?: DewormingTypeEnum;
  vetCabinetId?: number;
  vetTimeSlotId?: number;
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