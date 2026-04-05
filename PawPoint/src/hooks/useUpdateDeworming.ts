import { useMutation } from "@tanstack/react-query";
import {
  updateDeworming,
  type UpdateDewormingRequest,
} from "../api/updateDeworming";

type Variables = {
  dewormingId: number;
  payload: UpdateDewormingRequest;
};

export const useUpdateDeworming = () => {
  return useMutation({
    mutationFn: ({ dewormingId, payload }: Variables) =>
      updateDeworming(dewormingId, payload),
  });
};