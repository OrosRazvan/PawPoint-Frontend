import { useMutation } from "@tanstack/react-query";
import { deleteVaccination } from "../api/deleteVaccination";

export const useDeleteVaccination = () => {
  return useMutation({
    mutationFn: (vaccinationId: number) => deleteVaccination(vaccinationId),
  });
};