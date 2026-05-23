import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateDeworming,
  type UpdateDewormingRequest,
} from "../api/updateDeworming";
import type { DewormingDto } from "../pages/Deworming/types/deworming";

type Variables = {
  dewormingId: number;
  payload: UpdateDewormingRequest;
};

export const useUpdateDeworming = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dewormingId, payload }: Variables) =>
      updateDeworming(dewormingId, payload),

    onSuccess: async (updated) => {
      queryClient.setQueryData<DewormingDto[]>(["dewormings"], (old) => {
        if (!old) return [updated];

        return old.map((item) =>
          item.id === updated.id ? updated : item
        );
      });

      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["dewormingAvailability"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
      await queryClient.invalidateQueries({ queryKey: ["servicePrice"] });
    },
  });
};