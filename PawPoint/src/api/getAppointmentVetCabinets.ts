import { apiClient } from "./client";
import { GET_APPOINTMENT_VET_CABINETS_ENDPOINT } from "./endpoints/endpoints";
import type { VetCabinetDto } from "../pages/Appointments/types/appointment";

type Params = {
  serviceType?: string;
  sortBy?: string;
};

export const getAppointmentVetCabinets = async ({
  serviceType,
  sortBy,
}: Params = {}) => {
  const { data } = await apiClient.get<VetCabinetDto[]>(
    GET_APPOINTMENT_VET_CABINETS_ENDPOINT,
    {
      params: {
        serviceType: serviceType || undefined,
        sortBy: sortBy || undefined,
      },
    }
  );

  return data;
};