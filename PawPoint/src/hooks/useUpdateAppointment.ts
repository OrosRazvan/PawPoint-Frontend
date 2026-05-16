import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../api/updateAppointment";

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
    },
  });
};