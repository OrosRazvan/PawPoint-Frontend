export const VaccineType = {
  Rabies: 1,
  DHPPi: 2,
  Leptospirosis: 3,
  Bordetella: 4,
  LymeDisease: 5,
  CanineInfluenza: 6,
  FelineTrivalent: 20,
  FeLV: 21,
  FIV: 22,
  FelineChlamydia: 23,
  Myxomatosis: 40,
  RHD: 41,
} as const;

export type VaccineType = (typeof VaccineType)[keyof typeof VaccineType];

export const VaccineTypeLabels: Record<number, string> = {
  1: "Rabies",
  2: "DHPPi",
  3: "Leptospirosis",
  4: "Bordetella",
  5: "Lyme Disease",
  6: "Canine Influenza",
  20: "Feline Trivalent",
  21: "FeLV",
  22: "FIV",
  23: "Feline Chlamydia",
  40: "Myxomatosis",
  41: "RHD",
};

export const Currency = {
  Eur: 1,
  Ron: 2,
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export type VaccinationDto = {
  id: number;
  animalId: number;
  animalName: string;
  vaccineType: VaccineType | number | string;
  lastDate?: string | null;
  nextDate?: string | null;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc?: string | null;
  slotEndTimeUtc?: string | null;
  startTimeUtc?: string | null;
  endTimeUtc?: string | null;
  price?: number | null;
  currency?: Currency;
  notes?: string | null;
  lastDateUtc?: string | null;
  nextDateUtc?: string | null;
  slotStartUtc?: string | null;
  slotEndUtc?: string | null;
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
  vaccineType: VaccineType | "";
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
  vaccineType: VaccineType | number;
  lastDate?: string | null;
  nextDate?: string | null;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc: string;
  slotEndTimeUtc: string;
  price?: number | null;
  currency?: Currency;
  notes?: string | null;
  status: "completed" | "upcoming";
};