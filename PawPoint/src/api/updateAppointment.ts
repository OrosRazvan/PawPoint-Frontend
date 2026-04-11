import { apiClient } from "./client";
import { UPDATE_APPOINTMENT_ENDPOINT } from "./endpoints/endpoints";

type UpdateAppointmentPayload = {
  appointmentId: number;
  vetTimeSlotId?: number;
  estimatedPriceRon?: number | null;
  notes?: string | null;
  status?: string;
  notify24hInAdvance?: boolean;
};

export const updateAppointment = async ({
  appointmentId,
  ...payload
}: UpdateAppointmentPayload) => {
  const { data } = await apiClient.put(
    `${UPDATE_APPOINTMENT_ENDPOINT}/${appointmentId}`,
    payload
  );

  return data;
};