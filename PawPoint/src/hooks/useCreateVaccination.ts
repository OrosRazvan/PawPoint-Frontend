import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVaccination } from "../api/createVaccination";

export const useCreateVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVaccination,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};