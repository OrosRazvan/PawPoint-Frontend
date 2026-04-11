export type AppointmentDto = {
  id: number;
  animalId: number;
  animalName: string;
  serviceType: string;
  vetCabinetId: number;
  vetCabinetName: string;
  vetCabinetAddress?: string | null;
  vetTimeSlotId: number;
  slotStartTimeUtc?: string | null;
  slotEndTimeUtc?: string | null;
  startTimeUtc?: string | null;
  endTimeUtc?: string | null;
  vetDoctorName?: string | null;
  priceRon?: number | null;
  notes?: string | null;
};

export type AppointmentCardItem = {
  id: number;
  animalId: number;
  animalName: string;
  serviceType: string;
  vetCabinetId: number;
  vetCabinetName: string;
  vetCabinetAddress?: string | null;
  vetTimeSlotId: number;
  slotStartTimeUtc: string;
  slotEndTimeUtc: string;
  vetDoctorName?: string | null;
  priceRon?: number | null;
  notes?: string | null;
  status: "completed" | "upcoming";
};

export type VetCabinetDto = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  distanceKm?: number;
  basePriceRon?: number;
};

export type VetAvailabilitySlotDto = {
  id: number;
  vetCabinetId?: number;
  startTimeUtc: string;
  endTimeUtc: string;
  capacity?: number;
  bookedCount?: number;
};

export type AnimalDto = {
  id: number;
  name: string;
};

export type CreateAppointmentRequest = {
  animalId: number;
  vetCabinetId: number;
  vetTimeSlotId: number;
  serviceType: string;
  estimatedPriceRon?: number | null;
  notes?: string | null;
  notify24hInAdvance?: boolean;
};