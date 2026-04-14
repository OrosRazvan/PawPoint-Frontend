import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "../api/updateSettings";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};