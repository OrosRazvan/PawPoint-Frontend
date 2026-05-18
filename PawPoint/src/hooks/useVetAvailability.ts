import { useQuery } from "@tanstack/react-query";
import { getVetAvailability } from "../api/getVetAvailiability";

type Params = {
  vetCabinetId?: number;
  from?: string;
  to?: string;
  enabled?: boolean;
};

export const useVetAvailability = ({
  vetCabinetId,
  from,
  to,
  enabled = true,
}: Params) => {
  return useQuery({
    queryKey: ["vetAvailability", vetCabinetId, from, to],
    queryFn: () =>
      getVetAvailability({
        vetCabinetId: Number(vetCabinetId),
        from: String(from),
        to: String(to),
      }),
    enabled: enabled && !!vetCabinetId && !!from && !!to,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};