import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/getNotifications";
import { getAccessToken } from "../auth/tokenStorage";

type Params = {
  isRead?: boolean;
  typeId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const useNotifications = (params: Params = {}) => {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    refetchOnWindowFocus: true,
    enabled: !!token,
  });
};