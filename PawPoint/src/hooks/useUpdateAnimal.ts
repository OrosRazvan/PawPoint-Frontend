import { useMutation } from "@tanstack/react-query";
import { updateAnimal, type UpdateAnimalRequest } from "../api/updateAnimal";

type UpdateAnimalVariables = {
  animalId: number;
  payload: UpdateAnimalRequest;
};

export const useUpdateAnimal = () => {
  return useMutation({
    mutationFn: ({ animalId, payload }: UpdateAnimalVariables) =>
      updateAnimal(animalId, payload),
  });
};