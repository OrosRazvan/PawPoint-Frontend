import { apiClient } from "./client";
import { GET_ANIMALS_ENDPOINT } from "./endpoints/endpoints";
import type { AnimalDto } from "../pages/Appointments/types/appointment";

export const getAnimals = async () => {
  const { data } = await apiClient.get<AnimalDto[]>(GET_ANIMALS_ENDPOINT);
  return data;
};