import { apiClient } from "./client";
import { GET_VACCINATION_AVAILABILITY_ENDPOINT } from "./endpoints/endpoints";

type Params = {
  vetCabinetId: number;
  from: string;
  to: string;
};

export const getVaccinationAvailability = async ({
  vetCabinetId,
  from,
  to,
}: Params) => {
  const { data } = await apiClient.get(
    `${GET_VACCINATION_AVAILABILITY_ENDPOINT}/${vetCabinetId}`,
    {
      params: {
        from,
        to,
      },
    }
  );

  return data;
};