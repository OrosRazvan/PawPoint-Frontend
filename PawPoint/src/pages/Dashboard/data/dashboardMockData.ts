export type QuickActionItem = {
  id: string;
  labelKey: string;
  icon: "vaccination" | "appointment" | "deworming" | "pet";
  textColor: string;
  backgroundColor: string;
  onClick?: () => void;
};

export type UpcomingEventItem = {
  id: string;
  petName: string;
  typeKey: string;
  statusKey: string;
  date: string;
  time: string;
};

export type PetItem = {
  id: string;
  name: string;
  breed: string;
  weight: string;
  imageLetter: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const quickActionsMock: QuickActionItem[] = [
  {
    id: "1",
    labelKey: "dashboard:addVaccination",
    icon: "vaccination",
    textColor: "#1657ff",
    backgroundColor: "#edf3fb",
  },
  {
    id: "2",
    labelKey: "dashboard:bookAppointment",
    icon: "appointment",
    textColor: "#f59e0b",
    backgroundColor: "#f8ecd2",
  },
  {
    id: "3",
    labelKey: "dashboard:addDeworming",
    icon: "deworming",
    textColor: "#05a533",
    backgroundColor: "#e5f2ea",
  },
  {
    id: "4",
    labelKey: "dashboard:addNewPet",
    icon: "pet",
    textColor: "#ff5a1f",
    backgroundColor: "#f3ebe2",
  },
];

export const upcomingEventsMock: UpcomingEventItem[] = [
  {
    id: "1",
    petName: "Max",
    typeKey: "dashboard:annualCheckup",
    statusKey: "dashboard:upcoming",
    date: "Mar 15",
    time: "10:00 AM",
  },
];

export const petsMock: PetItem[] = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    weight: "32 kg",
    imageLetter: "M",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Siamese",
    weight: "4.5 kg",
    imageLetter: "L",
  },
];