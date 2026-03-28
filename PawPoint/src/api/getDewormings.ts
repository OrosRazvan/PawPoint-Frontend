import { apiClient } from "./client";
import { GET_DEWORMINGS_ENDPOINT } from "./endpoints/endpoints";
import type { DewormingDto } from "../pages/Dashboard/types/dashboard";

export const getDewormings = async() => {
    const { data } = await apiClient.get<DewormingDto[]>(GET_DEWORMINGS_ENDPOINT);
    return data;
}