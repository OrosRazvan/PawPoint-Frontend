import { useMutation } from "@tanstack/react-query";
import { deleteDeworming } from "../api/deleteDeworming";

export const useDeleteDeworming = () => {
  return useMutation({
    mutationFn: (dewormingId: number) => deleteDeworming(dewormingId),
  });
};