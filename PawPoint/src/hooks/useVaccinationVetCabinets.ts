import { useQuery } from "@tanstack/react-query";
import { getVaccinationVetCabinets } from "../api/getVaccinationVetCabinets";

export const useVaccinationVetCabinets = (enabled = true) => {
  return useQuery({
    queryKey: ["vaccinationVetCabinets"],
    queryFn: getVaccinationVetCabinets,
    enabled,
  });
};