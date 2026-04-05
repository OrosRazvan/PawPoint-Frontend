import { useQuery } from "@tanstack/react-query";
import { getVetCabinets } from "../api/getVetCabinets";

export const useVetCabinets = (enabled = true) => {
  return useQuery({
    queryKey: ["vetCabinets"],
    queryFn: getVetCabinets,
    enabled,
  });
};