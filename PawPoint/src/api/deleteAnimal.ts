import { apiClient } from "./client";
import { DELETE_ANIMAL_ENDPOINT } from "./endpoints/endpoints";

export const deleteAnimal = async (animalId: number) => {
  const { data } = await apiClient.delete(
    `${DELETE_ANIMAL_ENDPOINT}/${animalId}`
  );

  return data;
};