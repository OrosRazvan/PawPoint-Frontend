import { apiClient } from "./client";
import { GET_APPOINTMENTS_ENDPOINT } from "./endpoints/endpoints";
import type { AppointmentDto } from "../pages/Appointments/types/appointment";

export const getAppointments = async () => {
  const { data } = await apiClient.get<AppointmentDto[]>(
    GET_APPOINTMENTS_ENDPOINT
  );

  return data;
};