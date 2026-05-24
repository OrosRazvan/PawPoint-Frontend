import { useEffect, useMemo, useState } from "react";
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
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { getAnimals } from "../../../api/getAnimal";
import { useCreateDeworming } from "../../../hooks/useCreateDeworming";
import { useDewormingVetCabinets } from "../../../hooks/useDewormingVetCabinets";
import { useDewormingAvailability } from "../../../hooks/useDewormingAvailability";
import { useServicePrice } from "../../../hooks/useServicePrice";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { DewormingFormValues } from "../types/deworming";
import { formatConvertedPrice } from "../../../utils/price";

type Props = {
  open: boolean;
  onClose: () => void;
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

export const AddDewormingDialog = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation(["deworming"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const createDewormingMutation = useCreateDeworming();
  const { data: settings } = useSettings();

  const LAST_USED_CABINET_KEY = "deworming:lastUsedCabinetId";

  const { data: dewormings = [] } = useDewormings();

  const [lastUsedCabinetId, setLastUsedCabinetId] = useState<number | "">(() => {
    const saved = localStorage.getItem(LAST_USED_CABINET_KEY);
    return saved ? Number(saved) : "";
  });

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";
  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";

  const dewormingTypes = [
    { value: 1, label: t("deworming:typeInternal") },
    { value: 2, label: t("deworming:typeExternal") },
    { value: 3, label: t("deworming:typeCombined") },
    { value: 4, label: t("deworming:typeControl") },
  ];

  const { control, handleSubmit, reset, setValue } =
    useForm<DewormingFormValues>({
      defaultValues: {
        animalId: "",
        type: "",
        vetCabinetId: "",
        visitDate: "",
        vetTimeSlotId: "",
        notes: "",
      },
    });

    useEffect(() => {
      if (!open) return;

      reset({
        animalId: "",
        type: "",
        vetCabinetId: lastUsedCabinetId || "",
        visitDate: "",
        vetTimeSlotId: "",
        notes: "",
      });
    }, [open, lastUsedCabinetId, reset]);

  const selectedType = useWatch({ control, name: "type" });
  const selectedCabinetId = useWatch({ control, name: "vetCabinetId" });
  const selectedVisitDate = useWatch({ control, name: "visitDate" });

  const { data: servicePrice } = useServicePrice({
    vetCabinetId: selectedCabinetId,
    serviceType: "Deworming",
    dewormingType: selectedType,
    enabled: open,
  });

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
    vetCabinetId:
      typeof selectedCabinetId === "number"
        ? selectedCabinetId
        : selectedCabinetId
        ? Number(selectedCabinetId)
        : undefined,
    from: availabilityFrom,
    to: availabilityTo,
    enabled: open && !!selectedCabinetId && !!selectedVisitDate,
  });

  const bookedSlotIds = useMemo(() => {
  return new Set(
    dewormings
      .map((item) => Number(item.vetTimeSlotId))
      .filter(Boolean)
  );
}, [dewormings]);

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

  const onSubmit: SubmitHandler<DewormingFormValues> = (values) => {
    if (
      !values.animalId ||
      !values.type ||
      !values.vetCabinetId ||
      !values.vetTimeSlotId
    ) {
      return;
    }

    createDewormingMutation.mutate(
      {
        animalId: Number(values.animalId),
        type: values.type,
        vetCabinetId: Number(values.vetCabinetId),
        vetTimeSlotId: Number(values.vetTimeSlotId),
        notes: values.notes?.trim() || undefined,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("deworming:addSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["dewormings"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

          const cabinetId = Number(values.vetCabinetId);

          setLastUsedCabinetId(cabinetId);
          localStorage.setItem(LAST_USED_CABINET_KEY, String(cabinetId));

          queryClient.invalidateQueries({ queryKey: ["dewormings"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          queryClient.invalidateQueries({ queryKey: ["dewormingAvailability"] });

          reset({
            animalId: "",
            type: "",
            vetCabinetId: cabinetId,
            visitDate: "",
            vetTimeSlotId: "",
            notes: "",
          });

          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("deworming:addError"), {
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
                  {t("deworming:addDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("deworming:addDialogSubtitle")}
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
                    availableSlots.map((slot) => (
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

          {Array.isArray(slots) &&
            slots.length === 0 &&
            selectedCabinetId &&
            selectedVisitDate && (
              <Typography
                sx={(theme) => ({
                  mt: -1,
                  fontSize: scaleFont(12, settings?.textSize),
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.warning.main
                      : "#b45309",
                })}
              >
                {t("deworming:noSlotsAvailable")}
              </Typography>
            )}

          <Divider sx={{ mt: 1, mb: 1 }} />

          <LoadingButton
            type="submit"
            loading={createDewormingMutation.isPending}
            variant="contained"
            sx={{
              py: 1.45,
              px: 4,
              width: "fit-content",
              alignSelf: "center",
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
            {t("deworming:save")}
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};