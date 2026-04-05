import { apiClient } from "./client";
import { UPDATE_VACCINATION_ENDPOINT } from "./endpoints/endpoints";
import type { VaccinationDto } from "../pages/Vaccinations/types/vaccination";

export type UpdateVaccinationRequest = {
  vaccineName?: string;
  lastDate?: string;
  nextDate?: string;
  notes?: string;
};

export const updateVaccination = async (
  vaccinationId: number,
  payload: UpdateVaccinationRequest
) => {
  const { data } = await apiClient.put<VaccinationDto>(
    `${UPDATE_VACCINATION_ENDPOINT}/${vaccinationId}`,
    payload
  );

  return data;
};