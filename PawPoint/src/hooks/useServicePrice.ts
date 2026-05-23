import { useQuery } from "@tanstack/react-query";
import { getServicePrice } from "../api/getServicePrice";

type Params = {
  vetCabinetId?: number | "";
  serviceType: "Deworming" | "Vaccination";
  dewormingType?: number | "";
  vaccineType?: number | "";
  enabled?: boolean;
};

export const useServicePrice = ({
  vetCabinetId,
  serviceType,
  dewormingType,
  vaccineType,
  enabled = true,
}: Params) => {
  return useQuery({
    queryKey: ["servicePrice", vetCabinetId, serviceType, dewormingType, vaccineType],
    queryFn: () =>
      getServicePrice({
        vetCabinetId: Number(vetCabinetId),
        serviceType,
        dewormingType:
          serviceType === "Deworming" ? Number(dewormingType) : undefined,
        vaccineType:
          serviceType === "Vaccination" ? Number(vaccineType) : undefined,
      }),
    enabled:
      enabled &&
      !!vetCabinetId &&
      ((serviceType === "Deworming" && !!dewormingType) ||
        (serviceType === "Vaccination" && !!vaccineType)),
  });
};