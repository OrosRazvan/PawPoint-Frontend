import { apiClient } from "./client";
import { GET_SERVICE_PRICE_ENDPOINT } from "./endpoints/endpoints";

export type ServicePriceResponse = {
  price: number;
  currency: number;
};

type Params = {
  vetCabinetId: number;
  serviceType: "Deworming" | "Vaccination";
  dewormingType?: number;
  vaccineType?: number;
};

export const getServicePrice = async (params: Params) => {
  const { data } = await apiClient.get<ServicePriceResponse>(
    GET_SERVICE_PRICE_ENDPOINT,
    { params }
  );

  return data;
};