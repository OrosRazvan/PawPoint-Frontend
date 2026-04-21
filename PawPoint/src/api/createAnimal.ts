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
  image?: File | null;
  imagePositionY?: number;
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
  imageUrl?: string | null;
  imagePositionY?: number | null;
};

export const createAnimal = async (payload: CreateAnimalRequest) => {
  const formData = new FormData();

  formData.append("Name", payload.name);
  formData.append("Species", payload.species);

  if (payload.breed) {
    formData.append("Breed", payload.breed);
  }

  if (payload.weightKg !== undefined) {
    formData.append("WeightKg", String(payload.weightKg));
  }

  if (payload.birthDate) {
    formData.append("BirthDate", payload.birthDate);
  }

  if (payload.sex) {
    formData.append("Sex", payload.sex);
  }

  if (payload.microchipNumber) {
    formData.append("MicrochipNumber", payload.microchipNumber);
  }

  if (payload.image) {
    formData.append("Image", payload.image);
  }

  if (payload.imagePositionY !== undefined) {
    formData.append("ImagePositionY", String(payload.imagePositionY));
  }

  const { data } = await apiClient.post<AnimalResponse>(
    CREATE_ANIMAL_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};