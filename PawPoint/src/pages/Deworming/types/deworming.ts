export const DewormingTypeEnum = {
  Internal: 1,
  External: 2,
  Combined: 3,
  Control: 4,
} as const;

export type DewormingTypeEnum =
  (typeof DewormingTypeEnum)[keyof typeof DewormingTypeEnum];

export const DewormingTypeLabels: Record<number, string> = {
  1: "Internal",
  2: "External",
  3: "Combined",
  4: "Control",
};

export type DewormingDto = {
  id: number;
  animalId: number;
  animalName: string;
  type: DewormingTypeEnum | number;
  date?: string | null;
  nextDate?: string | null;
  intervalDays: number;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc?: string | null;
  slotEndTimeUtc?: string | null;
  startTimeUtc?: string | null;
  endTimeUtc?: string | null;
  notes?: string | null;
};

export type DewormingFormValues = {
  animalId: number | "";
  type: DewormingTypeEnum | "";
  intervalDays: number | "";
  vetCabinetId: number | "";
  visitDate: string;
  vetTimeSlotId: number | "";
  notes: string;
};

export type DewormingCardItem = {
  id: number;
  animalId: number;
  animalName: string;
  type: DewormingTypeEnum | number;
  date?: string | null;
  nextDate?: string | null;
  intervalDays: number;
  vetCabinetId: number;
  vetCabinetName: string;
  vetTimeSlotId: number;
  slotStartTimeUtc: string;
  slotEndTimeUtc: string;
  notes?: string | null;
  status: "completed" | "upcoming";
};