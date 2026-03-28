export type AnimalDto = {
  id: number;
  name: string;
  species?: string;
  breed?: string;
  weight?: number;
  weightKg?: number;
  birthDate?: string | null;
  sex?: string | null;
  microchipNumber?: string | null;
  profilePictureUrl?: string | null;
};

export type AppointmentDto = {
  id: number;
  animalId?: number;
  animalName?: string;
  appointmentDate?: string;
  date?: string;
  scheduledAt?: string;
  vetCabinetName?: string;
};

export type VaccinationDto = {
  id: number;
  animalId?: number;
  animalName?: string;
  vaccineName?: string;
  applicationDate?: string;
  date?: string;
};

export type DewormingDto = {
  id: number;
  animalId?: number;
  animalName?: string;
  productName?: string;
  administrationDate?: string;
  date?: string;
};

export type DashboardEvent = {
  id: string;
  petName: string;
  typeLabel: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
};

export type DashboardPet = {
  id: string;
  name: string;
  breed: string;
  weight: string;
  imageLetter: string;
  imageUrl?: string | null;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type QuickActionItem = {
  id: string;
  labelKey: string;
  icon: "vaccination" | "appointment" | "deworming" | "pet";
  textColor: string;
  backgroundColor: string;
  onClick?: () => void;
};