import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckIcon from "@mui/icons-material/Check";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";

import { useDewormings } from "../../hooks/useDewormings";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";
import { DewormingCard } from "./components/DewormingCard";
import { AddDewormingDialog } from "./components/AddDewormingDialog";
import { EditDewormingDialog } from "./components/EditDewormingDialog";
import { DeleteDewormingDialog } from "./components/DeleteDewormingDialog";
import {
  CompletedPeriodFilter,
  type CompletedFilterMonths,
} from "../../components/CompletedPeriodFilter";
import { filterCompletedByPeriod } from "../../utils/completedPeriodFilter";
import type { DewormingCardItem, DewormingDto } from "./types/deworming";

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

  const slotValue = pickFirst(
    item.slotStartTimeUtc,
    item.startTimeUtc,
    raw.SlotStartTimeUtc as string | undefined,
    raw.StartTimeUtc as string | undefined,
    item.nextDate,
    raw.NextDate as string | undefined,
    item.date,
    raw.Date as string | undefined
  );

  const slotDate = new Date(String(slotValue ?? "")).getTime();

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
        raw.animalName as string | undefined,
        raw.AnimalName as string | undefined
      ) ?? t("deworming:petFallback");

    const rawType = pickFirst(
      item.type,
      raw.type as number | string | undefined,
      raw.Type as number | string | undefined
    );

    const normalizedType =
      typeof rawType === "string" ? rawType.toLowerCase() : rawType;

    const type =
      normalizedType === "internal" || normalizedType === 1
        ? 1
        : normalizedType === "external" || normalizedType === 2
        ? 2
        : normalizedType === "combined" || normalizedType === 3
        ? 3
        : normalizedType === "control" || normalizedType === 4
        ? 4
        : 0;

    const date =
      pickFirst(
        item.dateUtc,
        raw.dateUtc as string | undefined,
        raw.DateUtc as string | undefined,
        item.date,
        raw.date as string | undefined,
        raw.Date as string | undefined
      ) ?? null;

    const nextDate =
      pickFirst(
        item.nextDateUtc,
        raw.nextDateUtc as string | undefined,
        raw.NextDateUtc as string | undefined,
        item.nextDate,
        raw.nextDate as string | undefined,
        raw.NextDate as string | undefined
      ) ?? null;

    const slotStartTimeUtc =
      pickFirst(
        item.slotStartUtc,
        raw.slotStartUtc as string | undefined,
        raw.SlotStartUtc as string | undefined,
        item.slotStartTimeUtc,
        raw.slotStartTimeUtc as string | undefined,
        raw.SlotStartTimeUtc as string | undefined,
        item.startTimeUtc,
        raw.StartTimeUtc as string | undefined,
        date ?? undefined
      ) ?? "";

    const slotEndTimeUtc =
      pickFirst(
        item.slotEndUtc,
        raw.slotEndUtc as string | undefined,
        raw.SlotEndUtc as string | undefined,
        item.slotEndTimeUtc,
        raw.slotEndTimeUtc as string | undefined,
        raw.SlotEndTimeUtc as string | undefined,
        item.endTimeUtc,
        raw.EndTimeUtc as string | undefined
      ) ?? "";

    const vetCabinetName =
      pickFirst(
        item.vetCabinetName,
        raw.vetCabinetName as string | undefined,
        raw.VetCabinetName as string | undefined
      ) ?? "";

    const notes = pickFirst(item.notes, raw.Notes as string | undefined) ?? null;

    return {
  id: item.id,
  animalId: item.animalId,
  animalName,
  type,
  date,
  nextDate,
  vetCabinetId: item.vetCabinetId,
  vetCabinetName,
  vetTimeSlotId: item.vetTimeSlotId,
  slotStartTimeUtc,
  slotEndTimeUtc,
  price: item.price ?? null,
  currency: item.currency,
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
  const { data: settings } = useSettings();

  const { data = [], isLoading, isError } = useDewormings();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<DewormingCardItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DewormingCardItem | null>(null);

  const [completedFilterMonths, setCompletedFilterMonths] =
    useState<CompletedFilterMonths>(3);

  const items = useMemo(() => mapDewormings(data, t), [data, t]);

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
              <BugReportOutlinedIcon sx={{ fontSize: 26 }} />
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
                {t("deworming:title")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {t("deworming:subtitle")}
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
            {t("deworming:addButton")}
          </Button>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">{t("deworming:loadError")}</Typography>
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
                    {t("deworming:upcoming")}
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
                      {t("deworming:completed")}
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
                    namespace="deworming"
                  />
                </Stack>

                <Grid container spacing={2.5}>
                  {filteredCompletedItems.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, md: 6, xl: 4 }}>
                      <DewormingCard item={item} />
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
                  <BugReportOutlinedIcon
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
                  {t("deworming:empty")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

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
      />
    </Box>
  );
};