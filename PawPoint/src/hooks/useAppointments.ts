import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/getAppointments";

export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
};