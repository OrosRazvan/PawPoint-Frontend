import { apiClient } from "./client";
import { CREATE_APPOINTMENT_ENDPOINT } from "./endpoints/endpoints";
import type {
  AppointmentDto,
  CreateAppointmentRequest,
} from "../pages/Appointments/types/appointment";

export const createAppointment = async (payload: CreateAppointmentRequest) => {
  const { data } = await apiClient.post<AppointmentDto>(
    CREATE_APPOINTMENT_ENDPOINT,
    payload
  );

  return data;
};