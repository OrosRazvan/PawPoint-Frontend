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

const resolveStatus = (item: DewormingDto): "completed" | "upcoming" => {
  const slotValue =
    item.slotStartTimeUtc ?? item.startTimeUtc ?? item.date ?? "";
  const slotDate = new Date(slotValue).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapDewormings = (items: DewormingDto[]): DewormingCardItem[] => {
  return items.map((item) => ({
    id: item.id,
    animalId: item.animalId,
    animalName: item.animalName ?? "Pet",
    type: item.type,
    date: item.date ?? null,
    nextDate: item.nextDate ?? null,
    intervalDays: item.intervalDays ?? 0,
    vetCabinetId: item.vetCabinetId,
    vetCabinetName: item.vetCabinetName,
    vetTimeSlotId: item.vetTimeSlotId,
    slotStartTimeUtc:
      item.slotStartTimeUtc ?? item.startTimeUtc ?? item.date ?? "",
    slotEndTimeUtc: item.slotEndTimeUtc ?? item.endTimeUtc ?? "",
    notes: item.notes ?? null,
    status: resolveStatus({
      ...item,
      slotStartTimeUtc:
        item.slotStartTimeUtc ?? item.startTimeUtc ?? item.date ?? "",
    } as DewormingDto),
  }));
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

  const items = useMemo(() => mapDewormings(data), [data]);

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
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f4ef",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
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
              sx={{
                fontSize: {
                  xs: scaleFont(34, settings?.textSize),
                  md: scaleFont(42, settings?.textSize),
                },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0b1f44",
              }}
            >
              {t("deworming:title")}
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontSize: scaleFont(18, settings?.textSize),
                color: "#5f7087",
              }}
            >
              {t("deworming:subtitle")}
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
                  sx={{
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: "#071c42",
                    mb: 3,
                  }}
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
                  sx={{
                    fontSize: scaleFont(24, settings?.textSize),
                    fontWeight: 700,
                    color: "#071c42",
                    mb: 3,
                  }}
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
                sx={{ color: "#667085", fontSize: scaleFont(16, settings?.textSize) }}
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