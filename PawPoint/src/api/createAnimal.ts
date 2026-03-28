import { apiClient } from "./client";
import { CREATE_ANIMAL_ENDPOINT } from "./endpoints/endpoints";

export type CreateAnimalRequest = {
  name: string;
  species: string;
  breed?: string;
  weightKg?: number;
  birthDate?: string;
  sex?: string;
  microchipNumber?: string;
};

export type AnimalResponse = {
  id: number;
  name: string;
  species: string;
  breed?: string | null;
  weightKg?: number | null;
  birthDate?: string | null;
  sex?: string | null;
  microchipNumber?: string | null;
};

export const createAnimal = async (payload: CreateAnimalRequest) => {
  const { data } = await apiClient.post<AnimalResponse>(
    CREATE_ANIMAL_ENDPOINT,
    payload
  );
  return data;
};