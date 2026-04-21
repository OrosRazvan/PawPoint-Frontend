import { Stack } from "@mui/material";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../cards/SectionCard";
import { QuickActionButton } from "../cards/QuickActionButton";
import type { QuickActionItem } from "../../types/dashboard";

type Props = {
  actions: QuickActionItem[];
};

const iconMap: Record<QuickActionItem["icon"], React.ReactNode> = {
  vaccination: <VaccinesOutlinedIcon sx={{ color: "#1657ff", fontSize: 20 }} />,
  appointment: <EventAvailableOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />,
  deworming: <BugReportOutlinedIcon sx={{ color: "#05a533", fontSize: 20 }} />,
  pet: <AddOutlinedIcon sx={{ color: "#ff5a1f", fontSize: 20 }} />,
};

export const QuickActionsSection = ({ actions }: Props) => {
  const { t } = useTranslation(["dashboard"]);

  return (
    <SectionCard title={t("dashboard:quickActions")}>
      <Stack spacing={1.5}>
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