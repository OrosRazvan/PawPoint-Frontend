import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../api/updateUserProfile";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};