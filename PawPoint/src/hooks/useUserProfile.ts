import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/getUserProfile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
};