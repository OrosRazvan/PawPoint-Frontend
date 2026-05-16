import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateDeworming,
  type UpdateDewormingRequest,
} from "../api/updateDeworming";

type Variables = {
  dewormingId: number;
  payload: UpdateDewormingRequest;
};

export const useUpdateDeworming = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dewormingId, payload }: Variables) =>
      updateDeworming(dewormingId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["dewormings"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};