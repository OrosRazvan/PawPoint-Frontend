import { useMutation } from "@tanstack/react-query";
import { deleteAnimal } from "../api/deleteAnimal";

export const useDeleteAnimal = () => {
  return useMutation({
    mutationFn: (animalId: number) => deleteAnimal(animalId),
  });
};