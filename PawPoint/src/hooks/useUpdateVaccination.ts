import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVaccination, type UpdateVaccinationRequest } from "../api/updateVaccination";

type Variables = {
  vaccinationId: number;
  payload: UpdateVaccinationRequest;
};

export const useUpdateVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaccinationId, payload }: Variables) =>
      updateVaccination(vaccinationId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};