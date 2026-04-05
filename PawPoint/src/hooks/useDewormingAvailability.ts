import { useQuery } from "@tanstack/react-query";
import { getDewormingAvailability } from "../api/getDewormingAvailability";

type Params = {
  vetCabinetId?: number;
  from?: string;
  to?: string;
  enabled?: boolean;
};

export const useDewormingAvailability = ({
  vetCabinetId,
  from,
  to,
  enabled = true,
}: Params) => {
  return useQuery({
    queryKey: ["dewormingAvailability", vetCabinetId, from, to],
    queryFn: () =>
      getDewormingAvailability({
        vetCabinetId: Number(vetCabinetId),
        from: String(from),
        to: String(to),
      }),
    enabled: enabled && !!vetCabinetId && !!from && !!to,
  });
};