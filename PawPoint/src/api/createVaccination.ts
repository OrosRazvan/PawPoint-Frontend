import { apiClient } from "./client";
import { CREATE_VACCINATION_ENDPOINT } from "./endpoints/endpoints";
import type { VaccinationDto } from "../pages/Vaccinations/types/vaccination";

export type CreateVaccinationRequest = {
  animalId: number;
  vaccineName: string;
  vetCabinetId: number;
  vetTimeSlotId: number;
  lastDate?: string;
  nextDate?: string;
  notes?: string;
};

export const createVaccination = async (payload: CreateVaccinationRequest) => {
  const { data } = await apiClient.post<VaccinationDto>(
    CREATE_VACCINATION_ENDPOINT,
    payload
  );

  return data;
};