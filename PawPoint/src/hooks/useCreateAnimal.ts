import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnimal } from "../api/createAnimal";

export const useCreateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnimal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};