import { useQuery } from "@tanstack/react-query";
import { getAnimals } from "../api/getAnimals";

export const useAnimals = (enabled = true) => {
  return useQuery({
    queryKey: ["animals"],
    queryFn: getAnimals,
    enabled,
  });
};