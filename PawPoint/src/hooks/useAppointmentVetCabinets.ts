import { useQuery } from "@tanstack/react-query";
import { getAppointmentVetCabinets } from "../api/getAppointmentVetCabinets";

type Props = {
  serviceType?: string;
  sortBy?: string;
  enabled?: boolean;
};

export const useAppointmentVetCabinets = ({
  serviceType,
  sortBy,
  enabled = true,
}: Props = {}) => {
  return useQuery({
    queryKey: ["appointmentVetCabinets", serviceType, sortBy],
    queryFn: () => getAppointmentVetCabinets({ serviceType, sortBy }),
    enabled,
  });
};