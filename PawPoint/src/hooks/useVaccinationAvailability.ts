import { useQuery } from "@tanstack/react-query";
import { getVaccinationAvailability } from "../api/getVaccinationAvailability";

type Props = {
  vetCabinetId?: number;
  from?: string;
  to?: string;
  enabled?: boolean;
};

export const useVaccinationAvailability = ({
  vetCabinetId,
  from,
  to,
  enabled = true,
}: Props) => {
  return useQuery({
    queryKey: ["vaccinationAvailability", vetCabinetId, from, to],
    queryFn: () =>
      getVaccinationAvailability({
        vetCabinetId: Number(vetCabinetId),
        from: String(from),
        to: String(to),
      }),
    enabled: enabled && !!vetCabinetId && !!from && !!to,
  });
};