import { useQuery } from "@tanstack/react-query";
import { getDewormings } from "../api/getDewormings";

export const useDewormings = () => {
  return useQuery({
    queryKey: ["dewormings"],
    queryFn: getDewormings,
  });
};