import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useDewormings } from "../../hooks/useDewormings";
import { useDeleteDeworming } from "../../hooks/useDeleteDeworming";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { DewormingCard } from "./components/DewormingCard";
import { AddDewormingDialog } from "./components/AddDewormingDialog";
import { EditDewormingDialog } from "./components/EditDewormingDialog";
import { DeleteDewormingDialog } from "./components/DeleteDewormingDialog";
import type { DewormingCardItem, DewormingDto } from "./types/deworming";
import { alpha } from "@mui/material/styles";

const pickFirst = <T,>(
  ...values: Array<T | undefined | null | "">
): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value as T;
    }
  }
  return undefined;
};

const resolveStatus = (item: DewormingDto): "completed" | "upcoming" => {
  const raw = item as Record<string, unknown>;

  const slotValue =
    pickFirst(
      item.slotStartTimeUtc,
      item.startTimeUtc,
      item.date,
      raw.SlotStartTimeUtc as string | undefined,
      raw.StartTimeUtc as string | undefined,
      raw.Date as string | undefined,
      raw.NextDate as string | undefined
    ) ?? "";

  const slotDate = new Date(String(slotValue)).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapDewormings = (
  items: DewormingDto[],
  t: (key: string) => string
): DewormingCardItem[] => {
  return items.map((item) => {
    const raw = item as Record<string, unknown>;

    const animalName =
      pickFirst(
        item.animalName,
        raw.AnimalName as string | undefined,
        raw.petName as string | undefined,
        raw.PetName as string | undefined
      ) ?? t("deworming:petFallback");

    const rawType = pickFirst(
      item.type,
      raw.Type as number | string | undefined,
      raw.dewormingType as number | string | undefined,
      raw.DewormingType as number | string | undefined,
      raw.dewormingTypeId as number | string | undefined,
      raw.DewormingTypeId as number | string | undefined
    );

    const type =
      typeof rawType === "string"
        ? rawType.toLowerCase() === "internal"
          ? 1
          : rawType.toLowerCase() === "external"
          ? 2
          : rawType.toLowerCase() === "combined"
          ? 3
          : rawType.toLowerCase() === "control"
          ? 4
          : 0
        : Number(rawType ?? 0);

    const date =
      pickFirst(
        item.date,
        raw.Date as string | undefined,
        raw.dateUtc as string | undefined,
        raw.DateUtc as string | undefined,
        raw.visitDate as string | undefined,
        raw.VisitDate as string | undefined,
        raw.dewormingDate as string | undefined,
        raw.DewormingDate as string | undefined,
        raw.scheduledDate as string | undefined,
        raw.ScheduledDate as string | undefined,
        item.slotStartTimeUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.slotStartUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        raw.timeSlotStartTimeUtc as string | undefined,
        raw.TimeSlotStartTimeUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined
      ) ?? null;

    const intervalDays = Number(
      pickFirst(
        item.intervalDays,
        raw.IntervalDays as number | undefined,
        raw.interval as number | undefined,
        raw.Interval as number | undefined,
        0
      )
    );

    const computedNextDate =
      date && intervalDays > 0
        ? new Date(
            new Date(date).getTime() + intervalDays * 24 * 60 * 60 * 1000
          ).toISOString()
        : null;

    const nextDate =
      pickFirst(
        item.nextDate,
        raw.NextDate as string | undefined,
        raw.nextDateUtc as string | undefined,
        raw.NextDateUtc as string | undefined,
        raw.nextDue as string | undefined,
        raw.NextDue as string | undefined,
        raw.nextDueDate as string | undefined,
        raw.NextDueDate as string | undefined
      ) ?? computedNextDate;

    const slotStartTimeUtc =
      pickFirst(
        item.slotStartTimeUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.slotStartUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        raw.timeSlotStartTimeUtc as string | undefined,
        raw.TimeSlotStartTimeUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined,
        date ?? undefined
      ) ?? "";

    const slotEndTimeUtc =
      pickFirst(
        item.slotEndTimeUtc,
        raw.SlotEndTimeUtc as string | undefined,
        raw.slotEndUtc as string | undefined,
        raw.SlotEndUtc as string | undefined,
        raw.timeSlotEndTimeUtc as string | undefined,
        raw.TimeSlotEndTimeUtc as string | undefined,
        item.endTimeUtc,
        raw.EndTimeUtc as string | undefined
      ) ?? "";

    const vetCabinetName =
      pickFirst(
        item.vetCabinetName,
        raw.VetCabinetName as string | undefined,
        raw.veterinarianName as string | undefined,
        raw.VeterinarianName as string | undefined,
        raw.clinicName as string | undefined,
        raw.ClinicName as string | undefined
      ) ?? "";

    const notes =
      pickFirst(item.notes, raw.Notes as string | undefined) ?? null;

    return {
      id: item.id,
      animalId: item.animalId,
      animalName,
      type,
      date,
      nextDate,
      intervalDays,
      vetCabinetId: item.vetCabinetId,
      vetCabinetName,
      vetTimeSlotId: item.vetTimeSlotId,
      slotStartTimeUtc,
      slotEndTimeUtc,
      notes,
      status: resolveStatus({
        ...item,
        slotStartTimeUtc,
        date,
        nextDate,
      } as DewormingDto),
    };
  });
};

export const Deworming = () => {
  const { t } = useTranslation(["deworming"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteDewormingMutation = useDeleteDeworming();
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useDewormings();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<DewormingCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DewormingCardItem | null>(null);

  const items = useMemo(() => mapDewormings(data, t), [data, t]);

  const completedItems = items.filter((item) => item.status === "completed");
  const upcomingItems = items.filter((item) => item.status === "upcoming");

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;

    deleteDewormingMutation.mutate(deleteItem.id, {
      onSuccess: () => {
        enqueueSnackbar(t("deworming:deleteSuccess"), {
          variant: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["dewormings"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
        setDeleteItem(null);
      },
      onError: () => {
        enqueueSnackbar(t("deworming:deleteError"), {
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
              {t("deworming:title")}
            </Typography>

            <Typography
              sx={(theme) => ({
                mt: 1.5,
                fontSize: scaleFont(18, settings?.textSize),
                color: theme.palette.text.secondary,
              })}
            >
              {t("deworming:subtitle")}
            </Typography>
          </Box>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsAddOpen(true)}
            sx={(theme) => ({
              px: 2.5,
              py: 1.2,
              borderRadius: 2.5,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              fontSize: scaleFont(14, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.1px",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow:
              theme.palette.mode === "dark"
                ? `0 6px 18px ${alpha(theme.palette.primary.main, 0.28)}`
                : `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
               },
            })}
          >
            {t("deworming:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("deworming:loadError")}</Typography>
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
                  {t("deworming:completed")}
                </Typography>

                <Grid container spacing={3}>
                  {completedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                      <DewormingCard item={item} />
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
                  {t("deworming:upcoming")}
                </Typography>

                <Grid container spacing={3}>
                  {upcomingItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                      <DewormingCard
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
                {t("deworming:empty")}
              </Typography>
            )}
          </Stack>
        )}

        <AddDewormingDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />

        <EditDewormingDialog
          open={!!editItem}
          item={editItem}
          onClose={() => setEditItem(null)}
        />

        <DeleteDewormingDialog
          open={!!deleteItem}
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteDewormingMutation.isPending}
        />
      </Stack>
    </Box>
  );
};