import { useQuery } from "@tanstack/react-query";
import { getVaccinations } from "../api/getVaccinations";

export const useVaccinations = () => {
  return useQuery({
    queryKey: ["vaccinations"],
    queryFn: getVaccinations,
  });
};