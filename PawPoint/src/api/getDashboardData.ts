import { getAnimals } from "./getAnimal";
import { getAppointments } from "./getAppointments";
import { getVaccinations } from "./getVaccinations";
import { getDewormings } from "./getDewormings";
import type {
  AnimalDto,
  AppointmentDto,
  DashboardEvent,
  DashboardPet,
  DewormingDto,
  VaccinationDto,
} from "../pages/Dashboard/types/dashboard";

type DashboardEventWithSortDate = DashboardEvent & {
  sortDate: string;
};

const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() ?? "?";

const formatDateLabel = (value: string) => {
  const date = new Date(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatTimeLabel = (value: string) => {
  const date = new Date(value);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const mapAnimalsToPets = (animals: AnimalDto[]): DashboardPet[] => {
  return animals.map((animal) => ({
    id: String(animal.id),
    name: animal.name,
    breed: animal.breed ?? animal.species ?? "Unknown",
    weight:
      typeof animal.weightKg === "number"
        ? `${animal.weightKg} kg`
        : typeof animal.weight === "number"
        ? `${animal.weight} kg`
        : "—",
    imageLetter: getInitial(animal.name),
    imageUrl: animal.profilePictureUrl ?? null,

    species: animal.species ?? "",
    weightKg:
      typeof animal.weightKg === "number"
        ? animal.weightKg
        : typeof animal.weight === "number"
        ? animal.weight
        : undefined,
    birthDate: animal.birthDate ?? null,
    sex: animal.sex ?? "",
    microchipNumber: animal.microchipNumber ?? "",
  }));
};

const mapAppointmentsToEvents = (
  items: AppointmentDto[]
): DashboardEventWithSortDate[] => {
  return items.flatMap((item) => {
    const rawDate =
      item.appointmentDate ?? item.date ?? item.scheduledAt ?? undefined;

    if (!rawDate) return [];

    return [
      {
        id: `appointment-${item.id}`,
        petName: item.animalName ?? "Pet",
        typeLabel: "Appointment",
        statusLabel: "upcoming",
        dateLabel: formatDateLabel(rawDate),
        timeLabel: formatTimeLabel(rawDate),
        sortDate: rawDate,
      },
    ];
  });
};

const mapVaccinationsToEvents = (
  items: VaccinationDto[]
): DashboardEventWithSortDate[] => {
  return items.flatMap((item) => {
    const rawDate = item.applicationDate ?? item.date ?? undefined;

    if (!rawDate) return [];

    return [
      {
        id: `vaccination-${item.id}`,
        petName: item.animalName ?? "Pet",
        typeLabel: item.vaccineName
          ? `Vaccination • ${item.vaccineName}`
          : "Vaccination",
        statusLabel: "upcoming",
        dateLabel: formatDateLabel(rawDate),
        timeLabel: formatTimeLabel(rawDate),
        sortDate: rawDate,
      },
    ];
  });
};

const mapDewormingsToEvents = (
  items: DewormingDto[]
): DashboardEventWithSortDate[] => {
  return items.flatMap((item) => {
    const rawDate = item.administrationDate ?? item.date ?? undefined;

    if (!rawDate) return [];

    return [
      {
        id: `deworming-${item.id}`,
        petName: item.animalName ?? "Pet",
        typeLabel: item.productName
          ? `Deworming • ${item.productName}`
          : "Deworming",
        statusLabel: "upcoming",
        dateLabel: formatDateLabel(rawDate),
        timeLabel: formatTimeLabel(rawDate),
        sortDate: rawDate,
      },
    ];
  });
};

export const getDashboardData = async () => {
  const [animals, appointments, vaccinations, dewormings] = await Promise.all([
    getAnimals(),
    getAppointments(),
    getVaccinations(),
    getDewormings(),
  ]);

  const pets = mapAnimalsToPets(animals);

  const upcomingEvents: DashboardEvent[] = [
    ...mapAppointmentsToEvents(appointments),
    ...mapVaccinationsToEvents(vaccinations),
    ...mapDewormingsToEvents(dewormings),
  ]
    .filter((event) => new Date(event.sortDate).getTime() >= Date.now())
    .sort(
      (a, b) =>
        new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
    )
    .slice(0, 5)
    .map(({ sortDate, ...event }) => event);

  return {
    pets,
    upcomingEvents,
  };
};