import { Stack } from "@mui/material";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../cards/SectionCard";
import { QuickActionButton } from "../cards/QuickActionButton";
import type { QuickActionItem } from "../../data/dashboardMockData";

type Props = {
  actions: QuickActionItem[];
};

const iconMap = {
  vaccination: <VaccinesOutlinedIcon sx={{ color: "#1657ff" }} />,
  appointment: <EventAvailableOutlinedIcon sx={{ color: "#f59e0b" }} />,
  deworming: <BugReportOutlinedIcon sx={{ color: "#05a533" }} />,
  pet: <AddOutlinedIcon sx={{ color: "#ff5a1f" }} />,
};

export const QuickActionsSection = ({ actions }: Props) => {
  const { t } = useTranslation(["dashboard"]);

  return (
    <SectionCard title={t("dashboard:quickActions")}>
      <Stack spacing={2}>
        {actions.map((action) => (
          <QuickActionButton
            key={action.id}
            label={t(action.labelKey)}
            icon={iconMap[action.icon]}
            textColor={action.textColor}
            backgroundColor={action.backgroundColor}
            onClick={action.onClick}
          />
        ))}
      </Stack>
    </SectionCard>
  );
};