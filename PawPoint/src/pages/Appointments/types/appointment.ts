export const Currency = {
  Eur: 1,
  Ron: 2,
} as const;

export type Currency =
  (typeof Currency)[keyof typeof Currency];

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

  price?: number | null;
  currency?: Currency;

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

  price?: number | null;
  currency?: Currency;

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
  price?: number | null;
  currency?: Currency;
};

export type VetAvailabilitySlotDto = {
  id: number;
  vetCabinetId?: number;
  startTimeUtc: string;
  endTimeUtc: string;
  capacity?: number;
  bookedCount?: number;
  availableCount?: number;
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

  price?: number | null;
  currency?: Currency;

  notes?: string | null;
  notify24hInAdvance?: boolean;
};