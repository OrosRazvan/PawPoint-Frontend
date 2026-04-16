import { Box, CircularProgress, Grid, Stack, Typography, Button } from "@mui/material";
// import { alpha } from "@mui/material/styles";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useVaccinations } from "../../hooks/useVaccinations";
import { useDeleteVaccination } from "../../hooks/useDeleteVaccination";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { VaccinationCard } from "./components/VaccinationCard";
import { AddVaccinationDialog } from "./components/AddVaccinationDialog";
import { EditVaccinationDialog } from "./components/EditVaccinationDialog";
import { DeleteVaccinationDialog } from "./components/DeleteVaccinationDialog";
import type { VaccinationCardItem, VaccinationDto } from "./types/vaccination";

const resolveStatus = (item: VaccinationDto): "completed" | "upcoming" => {
  const slotValue = item.slotStartTimeUtc ?? item.startTimeUtc ?? "";
  const slotDate = new Date(slotValue).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapVaccinations = (items: VaccinationDto[]): VaccinationCardItem[] => {
  return items.map((item) => ({
    id: item.id,
    animalId: item.animalId,
    animalName: item.animalName ?? "Pet",
    vaccineName: item.vaccineName ?? "Vaccination",
    lastDate: item.lastDate ?? null,
    nextDate: item.nextDate ?? null,
    vetCabinetId: item.vetCabinetId,
    vetCabinetName: item.vetCabinetName,
    vetTimeSlotId: item.vetTimeSlotId,
    slotStartTimeUtc: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
    slotEndTimeUtc: item.slotEndTimeUtc ?? item.endTimeUtc ?? "",
    notes: item.notes ?? null,
    status: resolveStatus({
      ...item,
      slotStartTimeUtc: item.slotStartTimeUtc ?? item.startTimeUtc ?? "",
    } as VaccinationDto),
  }));
};

export const Vaccinations = () => {
  const { t } = useTranslation(["vaccination"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteVaccinationMutation = useDeleteVaccination();
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useVaccinations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<VaccinationCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<VaccinationCardItem | null>(null);

  const items = useMemo(() => mapVaccinations(data), [data]);

  const completedItems = items.filter((item) => item.status === "completed");
  const upcomingItems = items.filter((item) => item.status === "upcoming");

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;

    deleteVaccinationMutation.mutate(deleteItem.id, {
      onSuccess: () => {
        enqueueSnackbar(t("vaccination:deleteSuccess"), {
          variant: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
        setDeleteItem(null);
      },
      onError: () => {
        enqueueSnackbar(t("vaccination:deleteError"), {
          variant: "error",
        });
      },
    });
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      })}
    >
      <Stack spacing={5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              sx={(theme) => ({
                fontSize: {
                  xs: scaleFont(34, settings?.textSize),
                  md: scaleFont(42, settings?.textSize),
                },
                fontWeight: 800,
                lineHeight: 1.1,
                color: theme.palette.text.primary,
              })}
            >
              {t("vaccination:title")}
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1.5,
                fontSize: scaleFont(18, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {t("vaccination:subtitle")}
            </Typography>
          </Box>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsAddOpen(true)}
            sx={{
              px: 2.5,
              py: 1.2,
              borderRadius: 2.5,
              color: "#fff",
              textTransform: "none",
              fontSize: scaleFont(14, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.1px",
              background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
              boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
              },
            }}
          >
            {t("vaccination:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("vaccination:loadError")}</Typography>
        ) : (
          <Stack spacing={5}>
            {completedItems.length > 0 && (
              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3,
                  })}
                >
                  {t("vaccination:completed")}
                </Typography>

                <Grid container spacing={3}>
                  {completedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                      <VaccinationCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {upcomingItems.length > 0 && (
              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 3,
                  })}
                >
                  {t("vaccination:upcoming")}
                </Typography>

                <Grid container spacing={3}>
                  {upcomingItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                      <VaccinationCard
                        item={item}
                        onEdit={() => setEditItem(item)}
                        onDelete={() => setDeleteItem(item)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {completedItems.length === 0 && upcomingItems.length === 0 && (
              <Typography
                sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: scaleFont(16, settings?.textSize),
                })}
              >
                {t("vaccination:empty")}
              </Typography>
            )}
          </Stack>
        )}

        <AddVaccinationDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />

        <EditVaccinationDialog
          open={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
        />

        <DeleteVaccinationDialog
          open={!!deleteItem}
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteVaccinationMutation.isPending}
        />
      </Stack>
    </Box>
  );
};