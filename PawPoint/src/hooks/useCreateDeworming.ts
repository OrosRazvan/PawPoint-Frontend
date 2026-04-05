import { useMutation } from "@tanstack/react-query";
import { createDeworming } from "../api/createDeworming";

export const useCreateDeworming = () => {
  return useMutation({
    mutationFn: createDeworming,
  });
};