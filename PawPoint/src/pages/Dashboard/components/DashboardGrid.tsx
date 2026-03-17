import { Grid } from "@mui/material";
import { QuickActionsSection } from "./sections/QuickActionsSection";
import { UpcomingEventsSection } from "./sections/UpcomingEventsSection";
import type { QuickActionItem, UpcomingEventItem } from "../data/dashboardMockData";

type Props = {
  quickActions: QuickActionItem[];
  upcomingEvents: UpcomingEventItem[];
};

export const DashboardGrid = ({ quickActions, upcomingEvents }: Props) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <QuickActionsSection actions={quickActions} />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <UpcomingEventsSection events={upcomingEvents} />
      </Grid>
    </Grid>
  );
};