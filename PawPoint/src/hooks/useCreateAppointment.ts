import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "../api/createAppointment";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};