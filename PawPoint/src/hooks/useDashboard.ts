import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../api/getDashboardData";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData
    });
};