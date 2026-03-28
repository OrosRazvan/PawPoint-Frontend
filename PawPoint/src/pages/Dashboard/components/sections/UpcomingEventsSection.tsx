import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../cards/SectionCard";
import { EventItem } from "../cards/EventItem";

type EventItemModel = {
  id: string;
  petName: string;
  typeLabel: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
};

type Props = {
  events: EventItemModel[];
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
            typeLabel={event.typeLabel}
            statusLabel={event.statusLabel}
            dateLabel={event.dateLabel}
            timeLabel={event.timeLabel}
          />
        ))}
      </Stack>
    </SectionCard>
  );
};