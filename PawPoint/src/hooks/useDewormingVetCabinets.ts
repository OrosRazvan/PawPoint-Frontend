import { useQuery } from "@tanstack/react-query";
import { getDewormingVetCabinets } from "../api/getDewormingVetCabinets";

export const useDewormingVetCabinets = (enabled = true) => {
  return useQuery({
    queryKey: ["dewormingVetCabinets"],
    queryFn: getDewormingVetCabinets,
    enabled,
  });
};