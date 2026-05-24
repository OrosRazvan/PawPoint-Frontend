import { useEffect, useMemo } from "react";
import { useDewormings } from "../../../hooks/useDewormings";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  Box,
  Divider,
  Button,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAnimals } from "../../../api/getAnimal";
import { useUpdateDeworming } from "../../../hooks/useUpdateDeworming";
import { useDewormingVetCabinets } from "../../../hooks/useDewormingVetCabinets";
import { useDewormingAvailability } from "../../../hooks/useDewormingAvailability";
import { useServicePrice } from "../../../hooks/useServicePrice";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { DewormingCardItem, DewormingTypeEnum } from "../types/deworming";
import { DewormingTypeEnum as DewormingType } from "../types/deworming";
import { formatConvertedPrice } from "../../../utils/price";

type Props = {
  open: boolean;
  item: DewormingCardItem | null;
  onClose: () => void;
};

type FormValues = {
  animalId: number | "";
  type: DewormingTypeEnum | "";
  vetCabinetId: number | "";
  visitDate: string;
  vetTimeSlotId: number | "";
  notes: string;
};

type AppDateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

const toDateOnly = (value: Date) => value.toISOString().split("T")[0];

const formatDateBySettings = (
  value?: string | Date | null,
  format: AppDateFormat = "DD/MM/YYYY"
) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

const formatSlotLabel = (
  start: string,
  end: string,
  dateFormat: AppDateFormat,
  locale: string
) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return `${formatDateBySettings(
    startDate,
    dateFormat
  )} • ${startDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const normalizeType = (value: string | number): DewormingTypeEnum | "" => {
  if (typeof value === "number") {
    switch (value) {
      case 1:
        return DewormingType.Internal;
      case 2:
        return DewormingType.External;
      case 3:
        return DewormingType.Combined;
      case 4:
        return DewormingType.Control;
      default:
        return "";
    }
  }

  switch (value.toLowerCase()) {
    case "internal":
      return DewormingType.Internal;
    case "external":
      return DewormingType.External;
    case "combined":
      return DewormingType.Combined;
    case "control":
      return DewormingType.Control;
    default:
      return "";
  }
};

export const EditDewormingDialog = ({ open, item, onClose }: Props) => {
  const { t, i18n } = useTranslation(["deworming"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateDewormingMutation = useUpdateDeworming();
  const { data: settings } = useSettings();
  const { data: dewormings = [] } = useDewormings();

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";
  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";

  const dewormingTypes = [
    { value: 1, label: t("deworming:typeInternal") },
    { value: 2, label: t("deworming:typeExternal") },
    { value: 3, label: t("deworming:typeCombined") },
    { value: 4, label: t("deworming:typeControl") },
  ];

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      animalId: "",
      type: "",
      vetCabinetId: "",
      visitDate: "",
      vetTimeSlotId: "",
      notes: "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCabinetId = useWatch({ control, name: "vetCabinetId" });
  const selectedVisitDate = useWatch({ control, name: "visitDate" });

  const { data: animals = [] } = useQuery({
    queryKey: ["animals"],
    queryFn: getAnimals,
    enabled: open,
  });

  const { data: cabinets = [] } = useDewormingVetCabinets(open);

  const availabilityFrom = useMemo(() => {
    if (selectedVisitDate) return selectedVisitDate;
    return toDateOnly(new Date());
  }, [selectedVisitDate]);

  const availabilityTo = useMemo(() => {
    const base = selectedVisitDate ? new Date(selectedVisitDate) : new Date();
    base.setDate(base.getDate() + 1);
    return toDateOnly(base);
  }, [selectedVisitDate]);

  const { data: slots = [] } = useDewormingAvailability({
    vetCabinetId: selectedCabinetId ? Number(selectedCabinetId) : undefined,
    from: availabilityFrom,
    to: availabilityTo,
    enabled: open && !!selectedCabinetId && !!selectedVisitDate,
  });

  const bookedSlotIds = useMemo(() => {
  return new Set(
    dewormings
      .filter((deworming) => deworming.id !== item?.id)
      .map((deworming) => Number(deworming.vetTimeSlotId))
      .filter(Boolean)
  );
}, [dewormings, item?.id]);

const availableSlots = useMemo(() => {
  if (!Array.isArray(slots)) return [];

  return slots.filter((slot) => {
    const startTime = new Date(slot.startTimeUtc).getTime();

    if (Number.isNaN(startTime)) return false;
    if (startTime <= Date.now()) return false;
    if (bookedSlotIds.has(Number(slot.id))) return false;

    const slotWithCapacity = slot as typeof slot & {
      capacity?: number;
      bookedCount?: number;
    };

    if (
      typeof slotWithCapacity.capacity === "number" &&
      typeof slotWithCapacity.bookedCount === "number"
    ) {
      return slotWithCapacity.bookedCount < slotWithCapacity.capacity;
    }

    return true;
  });
}, [slots, bookedSlotIds]);

const slotOptions = useMemo(() => {
  const currentSlot =
    item?.vetTimeSlotId && item?.slotStartTimeUtc && item?.slotEndTimeUtc
      ? {
          id: item.vetTimeSlotId,
          startTimeUtc: item.slotStartTimeUtc,
          endTimeUtc: item.slotEndTimeUtc,
        }
      : null;

    return currentSlot
      ? [
          currentSlot,
          ...availableSlots.filter((slot) => slot.id !== currentSlot.id),
        ]
      : availableSlots;
  }, [item, availableSlots]);

  const { data: servicePrice } = useServicePrice({
    vetCabinetId: selectedCabinetId,
    serviceType: "Deworming",
    dewormingType: selectedType,
    enabled: open,
  });

  useEffect(() => {
    if (!item || !open) return;

    reset({
      animalId: item.animalId,
      type: normalizeType(item.type),
      vetCabinetId: item.vetCabinetId,
      visitDate: item.slotStartTimeUtc
        ? item.slotStartTimeUtc.split("T")[0]
        : "",
      vetTimeSlotId: item.vetTimeSlotId,
      notes: item.notes ?? "",
    });
  }, [item, open, reset]);

  const fieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      fontSize: scaleFont(14, settings?.textSize),
      color: theme.palette.text.primary,
      transition: "box-shadow 0.2s ease",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused": {
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
            : "0 0 0 3px rgba(245,166,35,0.12)",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 0.8,
      fontSize: scaleFont(14, settings?.textSize),
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      fontSize: scaleFont(12, settings?.textSize),
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
    },
  });

  const labelSx = (theme: any) => ({
    fontSize: scaleFont(12, settings?.textSize),
    fontWeight: 600,
    color: theme.palette.text.secondary,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    mb: 0.6,
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (
      !item ||
      !values.animalId ||
      !values.type ||
      !values.vetCabinetId ||
      !values.vetTimeSlotId
    ) {
      return;
    }

    updateDewormingMutation.mutate(
      {
        dewormingId: item.id,
        payload: {
          animalId: Number(values.animalId),
          type: values.type,
          vetCabinetId: Number(values.vetCabinetId),
          vetTimeSlotId: Number(values.vetTimeSlotId),
          notes: values.notes?.trim() || undefined,
        },
      },
      {
        onSuccess: (updated) => {
          const selectedSlot = slots.find(
            (slot) => slot.id === Number(values.vetTimeSlotId)
          );

          const selectedCabinet = cabinets.find(
            (cabinet) => cabinet.id === Number(values.vetCabinetId)
          );

          queryClient.setQueryData(["dewormings"], (old: any[] | undefined) => {
            if (!old) return old;

            return old.map((deworming) =>
              deworming.id === item.id
                ? {
                    ...deworming,
                    ...updated,

                    animalId: Number(values.animalId),
                    type: values.type,

                    vetCabinetId: Number(values.vetCabinetId),
                    vetCabinetName:
                      selectedCabinet?.name ??
                      updated.vetCabinetName ??
                      deworming.vetCabinetName,

                    vetTimeSlotId: Number(values.vetTimeSlotId),

                    date:
                      selectedSlot?.startTimeUtc ??
                      updated.dateUtc ??
                      updated.date ??
                      deworming.date,

                    dateUtc:
                      selectedSlot?.startTimeUtc ??
                      updated.dateUtc ??
                      updated.date ??
                      deworming.dateUtc,

                    slotStartTimeUtc:
                      selectedSlot?.startTimeUtc ??
                      updated.slotStartUtc ??
                      updated.slotStartTimeUtc ??
                      deworming.slotStartTimeUtc,

                    slotStartUtc:
                      selectedSlot?.startTimeUtc ??
                      updated.slotStartUtc ??
                      updated.slotStartTimeUtc ??
                      deworming.slotStartUtc,

                    slotEndTimeUtc:
                      selectedSlot?.endTimeUtc ??
                      updated.slotEndUtc ??
                      updated.slotEndTimeUtc ??
                      deworming.slotEndTimeUtc,

                    slotEndUtc:
                      selectedSlot?.endTimeUtc ??
                      updated.slotEndUtc ??
                      updated.slotEndTimeUtc ??
                      deworming.slotEndUtc,
                  }
                : deworming
            );
          });

          enqueueSnackbar(t("deworming:updateSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          queryClient.invalidateQueries({ queryKey: ["dewormingAvailability"] });

          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("deworming:updateError"), {
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 64px rgba(0,0,0,0.38), 0 4px 12px rgba(0,0,0,0.24)"
              : "0 24px 64px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
        }),
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={(theme) => ({
            px: 3.5,
            pt: 3,
            pb: 2.5,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                : "linear-gradient(135deg, #fbf2ea 0%, #fdf7ef 100%)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -24,
              right: -24,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "rgba(245,166,35,0.08)",
              pointerEvents: "none",
            },
          })}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #f5a623 0%, #f0911a 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(245,166,35,0.32)",
                  flexShrink: 0,
                }}
              >
                <BugReportOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  })}
                >
                  {t("deworming:editDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("deworming:editDialogSubtitle")}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              size="small"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.06)
                    : "rgba(0,0,0,0.04)",
                borderRadius: 2,
                width: 32,
                height: 32,
                mt: 0.5,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "rgba(0,0,0,0.08)",
                  color: theme.palette.text.primary,
                },
              })}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider />
      </DialogTitle>

      <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography sx={labelSx}>{t("deworming:pet")}</Typography>
            <Controller
              name="animalId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("deworming:selectPet")}
                  </MenuItem>
                  {animals.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id}>
                      {animal.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("deworming:type")}</Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("deworming:selectType")}
                  </MenuItem>
                  {dewormingTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("deworming:vetCabinet")}</Typography>
            <Controller
              name="vetCabinetId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  sx={fieldSx}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue("vetTimeSlotId", "");
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("deworming:selectVetCabinet")}
                  </MenuItem>
                  {cabinets.map((cabinet) => (
                    <MenuItem key={cabinet.id} value={cabinet.id}>
                      {cabinet.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {servicePrice && (
            <Box
              sx={(theme) => ({
                mt: -0.5,
                px: 2,
                py: 1.5,
                borderRadius: 2.5,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.primary.main, 0.06),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(13.5, settings?.textSize),
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                })}
              >
                {t("deworming:estimatedPrice")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(15, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  letterSpacing: "-0.2px",
                })}
              >
                {formatConvertedPrice(
                  servicePrice.price,
                  servicePrice.currency,
                  settings?.currency ?? "EUR"
                )}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography sx={labelSx}>{t("deworming:visitDate")}</Typography>
            <Controller
              name="visitDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  fullWidth
                  sx={fieldSx}
                  inputProps={{
                    min: toDateOnly(new Date()),
                    max: toDateOnly(
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    ),
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue("vetTimeSlotId", "");
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("deworming:timeSlot")}</Typography>
            <Controller
              name="vetTimeSlotId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("deworming:selectTimeSlot")}
                  </MenuItem>
                  {Array.isArray(slots) &&
                    slotOptions.map((slot) => (
                      <MenuItem key={slot.id} value={slot.id}>
                        {formatSlotLabel(
                          slot.startTimeUtc,
                          slot.endTimeUtc,
                          dateFormat,
                          locale
                        )}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
          </Box>

          <Divider sx={{ mt: 1, mb: 1 }} />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="button"
              fullWidth
              onClick={onClose}
              sx={(theme) => ({
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(15, settings?.textSize),
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.06)
                    : "#f0f2f7",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "#e5e7ee",
                  color: theme.palette.text.primary,
                },
              })}
            >
              {t("deworming:cancel")}
            </Button>

            <LoadingButton
              type="submit"
              loading={updateDewormingMutation.isPending}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(15, settings?.textSize),
                background:
                  "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                color: "#fff",
                boxShadow: "0 6px 16px rgba(245,166,35,0.28)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #f0a020 0%, #e08510 100%)",
                  boxShadow: "0 8px 20px rgba(245,166,35,0.36)",
                },
              }}
            >
              {t("deworming:saveChanges")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};