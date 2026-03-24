import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../cards/SectionCard";
import { EventItem } from "../cards/EventItem";
import type { UpcomingEventItem } from "../../data/dashboardMockData";

type Props = {
  events: UpcomingEventItem[];
};

export const UpcomingEventsSection = ({ events }: Props) => {
  const { t } = useTranslation(["dashboard"]);

  return (
    <SectionCard title={t("dashboard:upcomingEvents")}>
      <Stack spacing={2}>
        {events.map((event) => (
          <EventItem
            key={event.id}
            petName={event.petName}
            typeLabel={t(event.typeKey)}
            statusLabel={t(event.statusKey)}
            dateLabel={event.date}
            timeLabel={event.time}
          />
        ))}
      </Stack>
    </SectionCard>
  );
};