import { Box, CircularProgress, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardBackground } from "./components/DashboardBackground";
import { DashboardContainer } from "./components/DashboardContainer";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardGrid } from "./components/DashboardGrid";
import { MyPetsSection } from "./components/sections/MyPetsSection";
import { useDashboard } from "../../hooks/useDashboard";
import { AddPetDialog } from "./components/AddPetDialog";
import type { QuickActionItem } from "./types/dashboard";

export const Dashboard = () => {
  const { t } = useTranslation(["dashboard"]);
  const { data, isLoading, isError } = useDashboard();
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const quickActions: QuickActionItem[] = useMemo(
    () => [
      {
        id: "1",
        labelKey: "dashboard:addVaccination",
        icon: "vaccination",
        textColor: "#1657ff",
        backgroundColor: "#edf3fb",
        onClick: () => {},
      },
      {
        id: "2",
        labelKey: "dashboard:bookAppointment",
        icon: "appointment",
        textColor: "#f59e0b",
        backgroundColor: "#f8ecd2",
        onClick: () => {},
      },
      {
        id: "3",
        labelKey: "dashboard:addDeworming",
        icon: "deworming",
        textColor: "#05a533",
        backgroundColor: "#e5f2ea",
        onClick: () => {},
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
    []
  );

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
              upcomingEvents={data?.upcomingEvents ?? []}
            />

            <MyPetsSection
              title={t("dashboard:myPets")}
              addPetLabel={t("dashboard:addPet")}
              pets={data?.pets ?? []}
              onAddPet={() => setIsAddPetOpen(true)}
            />
          </>
        )}

        <AddPetDialog
          open={isAddPetOpen}
          onClose={() => setIsAddPetOpen(false)}
        />
      </DashboardContainer>
    </DashboardBackground>
  );
};