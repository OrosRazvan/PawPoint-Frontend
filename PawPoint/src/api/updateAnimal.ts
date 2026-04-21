import { apiClient } from "./client";
import { UPDATE_ANIMAL_ENDPOINT } from "./endpoints/endpoints";

export type UpdateAnimalRequest = {
  name?: string;
  species?: string;
  breed?: string;
  weightKg?: number;
  birthDate?: string;
  sex?: string;
  microchipNumber?: string;
  image?: File | null;
  removeImage?: boolean;
  imagePositionY?: number;
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
  imageUrl?: string | null;
  imagePositionY?: number | null;
};

export const updateAnimal = async (
  animalId: number,
  payload: UpdateAnimalRequest
) => {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("Name", payload.name);
  }

  if (payload.species !== undefined) {
    formData.append("Species", payload.species);
  }

  if (payload.breed !== undefined) {
    formData.append("Breed", payload.breed);
  }

  if (payload.weightKg !== undefined) {
    formData.append("WeightKg", String(payload.weightKg));
  }

  if (payload.birthDate !== undefined) {
    formData.append("BirthDate", payload.birthDate);
  }

  if (payload.sex !== undefined) {
    formData.append("Sex", payload.sex);
  }

  if (payload.microchipNumber !== undefined) {
    formData.append("MicrochipNumber", payload.microchipNumber);
  }

  if (payload.image) {
    formData.append("Image", payload.image);
  }

  if (payload.removeImage !== undefined) {
    formData.append("RemoveImage", String(payload.removeImage));
  }

  if (payload.imagePositionY !== undefined) {
    formData.append("ImagePositionY", String(payload.imagePositionY));
  }

  const { data } = await apiClient.put<UpdateAnimalResponse>(
    `${UPDATE_ANIMAL_ENDPOINT}/${animalId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};