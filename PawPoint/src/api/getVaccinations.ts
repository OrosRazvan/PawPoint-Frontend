import { apiClient } from "./client";
import { GET_VACCINATIONS_ENDPOINT } from "./endpoints/endpoints";
import type { VaccinationDto } from "../pages/Vaccinations/types/vaccination";

export const getVaccinations = async () => {
  const { data } = await apiClient.get<VaccinationDto[]>(
    GET_VACCINATIONS_ENDPOINT
  );

  return data;
};