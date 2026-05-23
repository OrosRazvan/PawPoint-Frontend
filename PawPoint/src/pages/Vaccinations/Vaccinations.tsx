import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckIcon from "@mui/icons-material/Check";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";

import { useVaccinations } from "../../hooks/useVaccinations";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { VaccinationCard } from "./components/VaccinationCard";
import { AddVaccinationDialog } from "./components/AddVaccinationDialog";
import { EditVaccinationDialog } from "./components/EditVaccinationDialog";
import { DeleteVaccinationDialog } from "./components/DeleteVaccinationDialog";
import {
  CompletedPeriodFilter,
  type CompletedFilterMonths,
} from "../../components/CompletedPeriodFilter";
import { filterCompletedByPeriod } from "../../utils/completedPeriodFilter";
import type { VaccinationCardItem, VaccinationDto } from "./types/vaccination";

const pickFirst = <T,>(...values: T[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
};

const resolveStatus = (item: VaccinationDto): "completed" | "upcoming" => {
  const raw = item as Record<string, unknown>;

  const slotValue = pickFirst(
    item.slotStartTimeUtc,
    item.startTimeUtc,
    raw.SlotStartTimeUtc as string | undefined,
    raw.StartTimeUtc as string | undefined,
    item.nextDate,
    raw.NextDate as string | undefined,
    item.lastDate,
    raw.LastDate as string | undefined
  );

  const slotDate = new Date(String(slotValue ?? "")).getTime();

  if (Number.isNaN(slotDate)) {
    return "upcoming";
  }

  return slotDate <= Date.now() ? "completed" : "upcoming";
};

const mapVaccinations = (
  items: VaccinationDto[],
  t: (key: string) => string
) => {
  return items.map((item) => {
    const raw = item as Record<string, unknown>;

    const animalName =
      pickFirst(
        item.animalName,
        raw.AnimalName as string | undefined,
        raw.petName as string | undefined,
        raw.PetName as string | undefined
      ) ?? t("vaccination:petFallback");

    const vaccineType =
      Number(
        pickFirst(
          item.vaccineType,
          raw.VaccineType as number | undefined,
          raw.vaccineType as number | undefined
        )
      ) || 1;

    const lastDate =
      pickFirst(
        item.lastDate,
        item.lastDateUtc,
        raw.LastDate as string | undefined,
        raw.LastDateUtc as string | undefined,
        raw.date as string | undefined,
        raw.Date as string | undefined
      ) ?? null;

    const nextDate =
      pickFirst(
        item.nextDate,
        item.nextDateUtc,
        raw.NextDate as string | undefined,
        raw.NextDateUtc as string | undefined,
        item.slotStartTimeUtc,
        item.slotStartUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined
      ) ?? null;

    const slotStartTimeUtc =
      pickFirst(
        item.slotStartTimeUtc,
        item.slotStartUtc,
        raw.SlotStartTimeUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined,
        item.nextDate,
        raw.NextDate as string | undefined,
        item.lastDate,
        raw.LastDate as string | undefined
      ) ?? "";

    const slotEndTimeUtc =
      pickFirst(
        item.slotEndTimeUtc,
        item.slotEndUtc,
        raw.SlotEndTimeUtc as string | undefined,
        raw.SlotEndUtc as string | undefined,
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
      pickFirst(
        item.notes,
        raw.Notes as string | undefined
      ) ?? null;

    return {
      id: item.id,

      animalId: item.animalId,
      animalName,

      vaccineType,

      lastDate,
      nextDate,

      vetCabinetId: item.vetCabinetId,

      vetCabinetName:
        vetCabinetName ||
        item.vetCabinetName ||
        (raw.VetCabinetName as string | undefined) ||
        "",

      vetTimeSlotId: item.vetTimeSlotId,

      slotStartTimeUtc:
        slotStartTimeUtc ||
        item.slotStartUtc ||
        (raw.SlotStartUtc as string | undefined) ||
        "",

      slotEndTimeUtc:
        slotEndTimeUtc ||
        item.slotEndUtc ||
        (raw.SlotEndUtc as string | undefined) ||
        "",

      price:
        item.price ??
        (raw.Price as number | undefined) ??
        null,

      currency:
        item.currency ??
        (raw.Currency as number | undefined),

      notes,

      status: resolveStatus({
        ...item,
        slotStartTimeUtc:
          slotStartTimeUtc ||
          item.slotStartUtc ||
          (raw.SlotStartUtc as string | undefined) ||
          "",
      } as VaccinationDto),
    };
  });
};

export const Vaccinations = () => {
  const { t } = useTranslation(["vaccination"]);
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useVaccinations();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<VaccinationCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<VaccinationCardItem | null>(
    null
  );

  const [completedFilterMonths, setCompletedFilterMonths] =
    useState<CompletedFilterMonths>(3);

  const items: VaccinationCardItem[] = useMemo(
    () => mapVaccinations(data, t) as VaccinationCardItem[],
    [data, t]
  );

  const completedItems = useMemo(
    () => items.filter((item) => item.status === "completed"),
    [items]
  );

  const upcomingItems = useMemo(
    () => items.filter((item) => item.status === "upcoming"),
    [items]
  );

  const filteredCompletedItems = useMemo(
    () => filterCompletedByPeriod(completedItems, completedFilterMonths),
    [completedItems, completedFilterMonths]
  );

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
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 52,
                height: 52,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "#fff",
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.32
                )}`,
                flexShrink: 0,
              })}
            >
              <VaccinesOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Box>
              <Typography
                sx={(theme) => ({
                  fontSize: {
                    xs: scaleFont(28, settings?.textSize),
                    md: scaleFont(34, settings?.textSize),
                  },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: theme.palette.text.primary,
                  letterSpacing: "-0.5px",
                })}
              >
                {t("vaccination:title")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {t("vaccination:subtitle")}
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsAddOpen(true)}
            sx={(theme) => ({
              px: 2.75,
              py: 1.25,
              borderRadius: 2.5,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              fontSize: scaleFont(14, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.1px",
              whiteSpace: "nowrap",
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
            {t("vaccination:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("vaccination:loadError")}</Typography>
        ) : (
          <Stack spacing={5}>
            {upcomingItems.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Box
                    sx={(theme) => ({
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.warning.main, 0.16)
                          : "#fef3e2",
                    })}
                  >
                    <ScheduleRoundedIcon
                      sx={(theme) => ({
                        fontSize: 17,
                        color: theme.palette.warning.main,
                      })}
                    />
                  </Box>

                  <Typography
                    sx={(theme) => ({
                      fontSize: scaleFont(18, settings?.textSize),
                      fontWeight: 800,
                      color: theme.palette.text.primary,
                      letterSpacing: "-0.3px",
                    })}
                  >
                    {t("vaccination:upcoming")}
                  </Typography>

                  <Box
                    sx={(theme) => ({
                      px: 1.25,
                      py: 0.2,
                      borderRadius: 999,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.warning.main, 0.16)
                          : "#f8ecd8",
                      color: theme.palette.warning.main,
                      fontSize: scaleFont(12, settings?.textSize),
                      fontWeight: 700,
                    })}
                  >
                    {upcomingItems.length}
                  </Box>
                </Stack>

                <Grid container spacing={2.5}>
                  {upcomingItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
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

            {completedItems.length > 0 && (
              <Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                  sx={{ mb: 2.5 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={(theme) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.success.main, 0.14)
                            : "#dff4f1",
                      })}
                    >
                      <CheckCircleOutlineRoundedIcon
                        sx={(theme) => ({
                          fontSize: 17,
                          color: theme.palette.success.main,
                        })}
                      />
                    </Box>

                    <Typography
                      sx={(theme) => ({
                        fontSize: scaleFont(18, settings?.textSize),
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        letterSpacing: "-0.3px",
                      })}
                    >
                      {t("vaccination:completed")}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 999,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.success.main, 0.14)
                            : "#dff4f1",
                        border: (theme) =>
                          `1.5px solid ${alpha(
                            theme.palette.success.main,
                            0.28
                          )}`,
                        color: "success.main",
                        fontSize: scaleFont(12, settings?.textSize),
                        fontWeight: 700,
                      }}
                    >
                      <CheckIcon
                        sx={{ fontSize: scaleFont(13, settings?.textSize) }}
                      />
                      {filteredCompletedItems.length}
                    </Box>
                  </Stack>

                  <CompletedPeriodFilter
                    value={completedFilterMonths}
                    onChange={setCompletedFilterMonths}
                    namespace="vaccination"
                  />
                </Stack>

                <Grid container spacing={2.5}>
                  {filteredCompletedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <VaccinationCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {items.length === 0 && (
              <Box
                sx={(theme) => ({
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 4,
                  border: `1px dashed ${theme.palette.divider}`,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.02)
                      : alpha("#000000", 0.01),
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.14)
                        : alpha(theme.palette.primary.main, 0.07),
                  })}
                >
                  <VaccinesOutlinedIcon
                    sx={(theme) => ({
                      fontSize: 28,
                      color: theme.palette.primary.main,
                      opacity: 0.6,
                    })}
                  />
                </Box>

                <Typography
                  sx={(theme) => ({
                    color: theme.palette.text.secondary,
                    fontSize: scaleFont(14, settings?.textSize),
                    fontWeight: 500,
                  })}
                >
                  {t("vaccination:empty")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

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
      />
    </Box>
  );
};