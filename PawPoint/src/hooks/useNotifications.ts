import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/getNotifications";

type Params = {
  isRead?: boolean;
  typeId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const useNotifications = (params: Params = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    refetchOnWindowFocus: true,
  });
};