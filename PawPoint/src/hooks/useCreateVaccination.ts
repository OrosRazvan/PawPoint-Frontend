import { useMutation } from "@tanstack/react-query";
import { createVaccination } from "../api/createVaccination";

export const useCreateVaccination = () => {
  return useMutation({
    mutationFn: createVaccination,
  });
};