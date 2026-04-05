import { apiClient } from "./client";
import { GET_VET_AVAILABILITY_ENDPOINT } from "./endpoints/endpoints";
import type { VetAvailabilitySlotDto } from "../pages/Vaccinations/types/vaccination";

type Params = {
  vetCabinetId: number;
  from: string;
  to: string;
};

type AvailabilityDay = {
  date: string;
  slots: VetAvailabilitySlotDto[];
};

type AvailabilityResponse =
  | VetAvailabilitySlotDto[]
  | {
      vetCabinetId?: number;
      vetCabinetName?: string;
      days?: AvailabilityDay[];
    };

export const getVetAvailability = async ({
  vetCabinetId,
  from,
  to,
}: Params): Promise<VetAvailabilitySlotDto[]> => {
  const { data } = await apiClient.get<AvailabilityResponse>(
    `${GET_VET_AVAILABILITY_ENDPOINT}/${vetCabinetId}`,
    {
      params: { from, to },
    }
  );

  console.log("AVAILABILITY RAW:", data);

  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    "days" in data &&
    Array.isArray(data.days)
  ) {
    return data.days.flatMap((day) =>
      Array.isArray(day.slots) ? day.slots : []
    );
  }

  return [];
};