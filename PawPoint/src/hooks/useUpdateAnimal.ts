import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnimal, type UpdateAnimalRequest } from "../api/updateAnimal";

type UpdateAnimalVariables = {
  animalId: number;
  payload: UpdateAnimalRequest;
};

export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ animalId, payload }: UpdateAnimalVariables) =>
      updateAnimal(animalId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["animals"] });
    },
  });
};