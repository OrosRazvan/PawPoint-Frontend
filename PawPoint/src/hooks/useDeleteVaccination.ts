import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVaccination } from "../api/deleteVaccination";

export const useDeleteVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vaccinationId: number) => deleteVaccination(vaccinationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};