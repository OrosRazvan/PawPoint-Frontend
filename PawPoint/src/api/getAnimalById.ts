import { apiClient } from "./client";
import { GET_ANIMAL_BY_ID_ENDPOINT } from "./endpoints/endpoints";
import type { AnimalDto } from "../pages/Dashboard/types/dashboard";

export const getAnimalById = async (animalId: number) => {
  const { data } = await apiClient.get<AnimalDto>(
    `${GET_ANIMAL_BY_ID_ENDPOINT}/${animalId}`
  );

  return data;
};