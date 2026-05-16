import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeworming } from "../api/createDeworming";

export const useCreateDeworming = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeworming,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["dewormings"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};