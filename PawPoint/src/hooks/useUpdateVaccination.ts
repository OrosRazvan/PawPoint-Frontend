import { useMutation } from "@tanstack/react-query";
import { updateVaccination, type UpdateVaccinationRequest } from "../api/updateVaccination";

type Variables = {
  vaccinationId: number;
  payload: UpdateVaccinationRequest;
};

export const useUpdateVaccination = () => {
  return useMutation({
    mutationFn: ({ vaccinationId, payload }: Variables) =>
      updateVaccination(vaccinationId, payload),
  });
};