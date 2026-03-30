import { apiClient } from "./client";
import { UPDATE_ANIMAL_ENDPOINT } from "./endpoints/endpoints";

export type UpdateAnimalRequest = {
  name: string;
  species: string;
  breed?: string;
  weightKg?: number;
  birthDate?: string;
  sex?: string;
  microchipNumber?: string;
};

export type UpdateAnimalResponse = {
  id: number;
  name: string;
  species: string;
  breed?: string | null;
  weightKg?: number | null;
  birthDate?: string | null;
  sex?: string | null;
  microchipNumber?: string | null;
};

export const updateAnimal = async (
  animalId: number,
  payload: UpdateAnimalRequest
) => {
  const { data } = await apiClient.put<UpdateAnimalResponse>(
    `${UPDATE_ANIMAL_ENDPOINT}/${animalId}`,
    payload
  );

  return data;
};