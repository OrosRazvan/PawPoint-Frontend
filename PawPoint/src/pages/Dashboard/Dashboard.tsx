import { Box, CircularProgress, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardBackground } from "./components/DashboardBackground";
import { DashboardContainer } from "./components/DashboardContainer";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardGrid } from "./components/DashboardGrid";
import { MyPetsSection } from "./components/sections/MyPetsSection";
import { useDashboard } from "../../hooks/useDashboard";
import { AddPetDialog } from "./components/AddPetDialog";
import { EditPetDialog } from "./components/EditPetDialog";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAnimal } from "../../hooks/useDeleteAnimal";
import type { QuickActionItem, DashboardPet } from "./types/dashboard";
import { useAppointments } from "../../hooks/useAppointments";
import { useVaccinations } from "../../hooks/useVaccinations";
import { useDewormings } from "../../hooks/useDewormings";

export const Dashboard = () => {
  const { t } = useTranslation(["dashboard"]);
  const { data, isLoading, isError } = useDashboard();
  const { data: appointments = [] } = useAppointments();
  const { data: vaccinations = [] } = useVaccinations();
  const { data: dewormings = [] } = useDewormings();
  const navigate = useNavigate();

  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isEditPetOpen, setIsEditPetOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<DashboardPet | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteAnimalMutation = useDeleteAnimal();

  const quickActions: QuickActionItem[] = useMemo(
    () => [
      {
        id: "1",
        labelKey: "dashboard:addVaccination",
        icon: "vaccination",
        textColor: "#1657ff",
        backgroundColor: "#edf3fb",
        onClick: () => navigate("/vaccinations"),
      },
      {
        id: "2",
        labelKey: "dashboard:bookAppointment",
        icon: "appointment",
        textColor: "#f59e0b",
        backgroundColor: "#f8ecd2",
        onClick: () => navigate("/appointments"),
      },
      {
        id: "3",
        labelKey: "dashboard:addDeworming",
        icon: "deworming",
        textColor: "#05a533",
        backgroundColor: "#e5f2ea",
        onClick: () => navigate("/deworming"),
      },
      {
        id: "4",
        labelKey: "dashboard:addNewPet",
        icon: "pet",
        textColor: "#ff5a1f",
        backgroundColor: "#f3ebe2",
        onClick: () => setIsAddPetOpen(true),
      },
    ],
    [navigate, setIsAddPetOpen]
  );

  const upcomingEvents = useMemo(() => {
    const appointmentItems = appointments.map((item: any) => {
      const rawDate =
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        item.dateUtc ??
        item.DateUtc ??
        item.date ??
        item.Date ??
        "";

      return {
        id: `appointment-${item.id}`,
        petName: item.animalName ?? item.petName ?? "Pet",
        typeLabel: item.serviceType ?? "Appointment",
        statusLabel: "Upcoming",
        rawDate,
      };
    });

    const vaccinationItems = vaccinations.map((item: any) => {
      const rawDate =
        item.dateUtc ??
        item.DateUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        item.nextDateUtc ??
        item.NextDateUtc ??
        item.nextDate ??
        item.NextDate ??
        item.date ??
        item.Date ??
        "";

      return {
        id: `vaccination-${item.id}`,
        petName: item.animalName ?? item.petName ?? "Pet",
        typeLabel: item.vaccineName ?? "Vaccination",
        statusLabel: "Upcoming",
        rawDate,
      };
    });

    const dewormingItems = dewormings.map((item: any) => {
      const rawDate =
        item.dateUtc ??
        item.DateUtc ??
        item.slotStartUtc ??
        item.SlotStartUtc ??
        item.slotStartTimeUtc ??
        item.SlotStartTimeUtc ??
        item.startTimeUtc ??
        item.StartTimeUtc ??
        item.nextDateUtc ??
        item.NextDateUtc ??
        item.nextDate ??
        item.NextDate ??
        item.date ??
        item.Date ??
        "";

      return {
        id: `deworming-${item.id}`,
        petName: item.animalName ?? item.petName ?? "Pet",
        typeLabel: item.productName ?? item.type ?? "Deworming",
        statusLabel: "Upcoming",
        rawDate,
      };
    });

    return [...appointmentItems, ...vaccinationItems, ...dewormingItems]
      .map((item) => {
        const date = new Date(item.rawDate);
        const time = date.getTime();

        return {
          ...item,
          time,
        };
      })
      .filter((item) => !Number.isNaN(item.time) && item.time >= Date.now())
      .sort((a, b) => a.time - b.time)
      .slice(0, 3)
      .map(({ time, ...item }) => ({
        ...item,
        dateValue: item.rawDate,
      }));
  }, [appointments, vaccinations, dewormings]);

  const handleViewPet = (pet: DashboardPet) => {
    navigate(`/animals/${pet.id}`);
  };

  const handleOpenEditPet = (pet: DashboardPet) => {
    setSelectedPet(pet);
    setIsEditPetOpen(true);
  };

  const handleCloseEditPet = () => {
    setIsEditPetOpen(false);
    setSelectedPet(null);
  };

  const handleDeletePet = (pet: DashboardPet) => {
    deleteAnimalMutation.mutate(Number(pet.id), {
      onSuccess: () => {
        enqueueSnackbar(t("dashboard:deletePetSuccess"), {
          variant: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      },
      onError: () => {
        enqueueSnackbar(t("dashboard:deletePetError"), {
          variant: "error",
        });
      },
    });
  };

  return (
    <DashboardBackground>
      <DashboardContainer>
        <DashboardHeader
          title={t("dashboard:title")}
          subtitle={t("dashboard:subtitle")}
        />

        {isLoading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("dashboard:loadError")}</Typography>
        ) : (
          <>
            <DashboardGrid
              quickActions={quickActions}
              upcomingEvents={upcomingEvents}
            />

            <MyPetsSection
              title={t("dashboard:myPets")}
              addPetLabel={t("dashboard:addPet")}
              pets={data?.pets ?? []}
              onAddPet={() => setIsAddPetOpen(true)}
              onViewPet={handleViewPet}
              onEditPet={handleOpenEditPet}
              onDeletePet={handleDeletePet}
              isDeleting={deleteAnimalMutation.isPending}
            />
          </>
        )}

        <AddPetDialog
          open={isAddPetOpen}
          onClose={() => setIsAddPetOpen(false)}
        />

        <EditPetDialog
          open={isEditPetOpen}
          onClose={handleCloseEditPet}
          pet={selectedPet}
        />
      </DashboardContainer>
    </DashboardBackground>
  );
};