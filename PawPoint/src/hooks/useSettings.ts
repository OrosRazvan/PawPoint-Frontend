import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../api/getSettings";
import { getAccessToken } from "../auth/tokenStorage";

export const useSettings = () => {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    enabled: !!token,
  });
};