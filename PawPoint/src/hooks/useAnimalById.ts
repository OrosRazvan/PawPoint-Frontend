import { useQuery } from "@tanstack/react-query";
import { getAnimalById } from "../api/getAnimalById";

export const useAnimalById = (animalId?: number) => {
  return useQuery({
    queryKey: ["animalById", animalId],
    queryFn: () => getAnimalById(Number(animalId)),
    enabled: !!animalId,
  });
};