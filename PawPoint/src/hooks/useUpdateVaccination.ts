import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateVaccination,
  type UpdateVaccinationRequest,
} from "../api/updateVaccination";
import type { VaccinationDto } from "../pages/Vaccinations/types/vaccination";

type Variables = {
  vaccinationId: number;
  payload: UpdateVaccinationRequest;
};

export const useUpdateVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vaccinationId, payload }: Variables) =>
      updateVaccination(vaccinationId, payload),

    onSuccess: async (updated) => {
      queryClient.setQueryData<VaccinationDto[]>(["vaccinations"], (old) => {
        if (!old) return [updated];

        return old.map((item) =>
          item.id === updated.id ? updated : item
        );
      });

      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["vaccinationAvailability"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
      await queryClient.invalidateQueries({ queryKey: ["servicePrice"] });
    },
  });
};