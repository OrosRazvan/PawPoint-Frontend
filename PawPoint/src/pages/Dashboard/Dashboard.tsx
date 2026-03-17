import { useTranslation } from "react-i18next";
import { DashboardBackground } from "./components/DashboardBackground";
import { DashboardContainer } from "./components/DashboardContainer";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardGrid } from "./components/DashboardGrid";
import { MyPetsSection } from "./components/sections/MyPetsSection";
import {
  quickActionsMock,
  upcomingEventsMock,
  petsMock,
} from "./data/dashboardMockData";

export const Dashboard = () => {
  const { t } = useTranslation(["dashboard"]);

  return (
    <DashboardBackground>
      <DashboardContainer>
        <DashboardHeader
          title={t("dashboard:title")}
          subtitle={t("dashboard:subtitle")}
        />

        <DashboardGrid
          quickActions={quickActionsMock}
          upcomingEvents={upcomingEventsMock}
        />

        <MyPetsSection
          title={t("dashboard:myPets")}
          addPetLabel={t("dashboard:addPet")}
          pets={petsMock}
        />
      </DashboardContainer>
    </DashboardBackground>
  );
};