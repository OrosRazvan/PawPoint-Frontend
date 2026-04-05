export type VaccinationDto = {
  id: number;
  animalId: number;
  animalName: string;
  vaccineName: string;
  lastDate?: string | null;
  nextDate?: string | null;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc?: string | null;
  slotEndTimeUtc?: string | null;
  startTimeUtc?: string | null;
  endTimeUtc?: string | null;
  notes?: string | null;
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
  startTimeUtc: string;
  endTimeUtc: string;
  capacity?: number;
  bookedCount?: number;
};

export type VaccinationFormValues = {
  animalId: number | "";
  vaccineName: string;
  vetCabinetId: number | "";
  visitDate: string;
  vetTimeSlotId: number | "";
  lastDate: string;
  nextDate: string;
  notes: string;
};

export type VaccinationCardItem = {
  id: number;
  animalId: number;
  animalName: string;
  vaccineName: string;
  lastDate?: string | null;
  nextDate?: string | null;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc: string;
  slotEndTimeUtc: string;
  notes?: string | null;
  status: "completed" | "upcoming";
};