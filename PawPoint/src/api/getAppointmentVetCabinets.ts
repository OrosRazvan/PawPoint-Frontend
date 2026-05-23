import { apiClient } from "./client";
import { GET_APPOINTMENT_VET_CABINETS_ENDPOINT } from "./endpoints/endpoints";
import {
  Currency,
  type VetCabinetDto,
} from "../pages/Appointments/types/appointment";

type Params = {
  serviceType?: string;
  sortBy?: string;
};

type RawVetCabinetDto = VetCabinetDto & {
  Price?: number | null;
  price?: number | null;
  Currency?: Currency;
  currency?: Currency;
  BasePriceRon?: number | null;
  basePriceRon?: number | null;
};

export const getAppointmentVetCabinets = async ({
  serviceType,
  sortBy,
}: Params = {}): Promise<VetCabinetDto[]> => {
  const { data } = await apiClient.get<RawVetCabinetDto[]>(
    GET_APPOINTMENT_VET_CABINETS_ENDPOINT,
    {
      params: {
        serviceType: serviceType || undefined,
        sortBy: sortBy || undefined,
      },
    }
    
  );

  console.log("APPOINTMENT CABINETS RAW", data);

  return data.map((cabinet) => ({
    ...cabinet,
    price:
      cabinet.price ??
      cabinet.Price ??
      cabinet.basePriceRon ??
      cabinet.BasePriceRon ??
      null,
    currency:
      cabinet.currency ??
      cabinet.Currency ??
      Currency.Ron,
  }));
};
