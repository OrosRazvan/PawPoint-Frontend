import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../api/getSettings";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
};