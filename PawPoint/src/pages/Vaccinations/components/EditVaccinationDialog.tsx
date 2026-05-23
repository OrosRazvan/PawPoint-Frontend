import { useEffect, useMemo } from "react";
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
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAnimals } from "../../../api/getAnimal";
import { useUpdateVaccination } from "../../../hooks/useUpdateVaccination";
import { useVaccinationVetCabinets } from "../../../hooks/useVaccinationVetCabinets";
import { useVetAvailability } from "../../../hooks/useVetAvailability";
import { useServicePrice } from "../../../hooks/useServicePrice";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import {
  VaccineTypeLabels,
  type VaccinationCardItem,
} from "../types/vaccination";
import { formatConvertedPrice } from "../../../utils/price";

type Props = {
  open: boolean;
  item: VaccinationCardItem | null;
  onClose: () => void;
};

type FormValues = {
  animalId: number | "";
  vaccineType: number | "";
  vetCabinetId: number | "";
  visitDate: string;
  vetTimeSlotId: number | "";
  lastDate: string;
  nextDate: string;
};

type AnimalOption = {
  id: number;
  name: string;
};

type CabinetOption = {
  id: number;
  name: string;
};

type SlotOption = {
  id: number;
  startTimeUtc: string;
  endTimeUtc: string;
};

type VaccinationCacheItem = {
  id: number;
  [key: string]: unknown;
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

const formatCurrency = (currency?: number) => {
  return currency === 2 ? "RON" : "EUR";
};

export const EditVaccinationDialog = ({ open, item, onClose }: Props) => {
  const { t, i18n } = useTranslation(["vaccination"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateVaccinationMutation = useUpdateVaccination();
  const { data: settings } = useSettings();

  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";
  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  const vaccineTypes = Object.entries(VaccineTypeLabels).map(
    ([value, label]) => ({
      value: Number(value),
      label,
    })
  );

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      animalId: "",
      vaccineType: "",
      vetCabinetId: "",
      visitDate: "",
      vetTimeSlotId: "",
      lastDate: "",
      nextDate: "",
    },
  });

  const selectedVaccineType = useWatch({ control, name: "vaccineType" });
  const selectedCabinetId = useWatch({ control, name: "vetCabinetId" });
  const selectedVisitDate = useWatch({ control, name: "visitDate" });

  const { data: animals = [] } = useQuery<AnimalOption[]>({
    queryKey: ["animals"],
    queryFn: getAnimals,
    enabled: open,
  });

  const { data: cabinets = [] } = useVaccinationVetCabinets(open) as {
    data: CabinetOption[];
  };

  const availabilityFrom = useMemo(() => {
    if (selectedVisitDate) return selectedVisitDate;
    return toDateOnly(new Date());
  }, [selectedVisitDate]);

  const availabilityTo = useMemo(() => {
    const base = selectedVisitDate ? new Date(selectedVisitDate) : new Date();
    base.setDate(base.getDate() + 1);
    return toDateOnly(base);
  }, [selectedVisitDate]);

  const { data: slots = [] } = useVetAvailability({
    vetCabinetId: selectedCabinetId ? Number(selectedCabinetId) : undefined,
    from: availabilityFrom,
    to: availabilityTo,
    enabled: open && !!selectedCabinetId && !!selectedVisitDate,
  }) as {
    data: SlotOption[];
  };

  const slotOptions = useMemo<SlotOption[]>(() => {
    const currentSlot =
      item?.vetTimeSlotId && item?.slotStartTimeUtc && item?.slotEndTimeUtc
        ? {
            id: item.vetTimeSlotId,
            startTimeUtc: item.slotStartTimeUtc,
            endTimeUtc: item.slotEndTimeUtc,
          }
        : null;

    const merged = currentSlot
      ? [
          currentSlot,
          ...slots.filter((slot) => slot.id !== currentSlot.id),
        ]
      : slots;

    return merged;
  }, [item, slots]);

  const { data: servicePrice } = useServicePrice({
    vetCabinetId: selectedCabinetId,
    serviceType: "Vaccination",
    vaccineType: selectedVaccineType,
    enabled: open,
  });

  useEffect(() => {
    if (!item || !open) return;

    reset({
      animalId: item.animalId,
      vaccineType: Number(item.vaccineType) || "",
      vetCabinetId: item.vetCabinetId,
      visitDate: item.slotStartTimeUtc
        ? item.slotStartTimeUtc.split("T")[0]
        : "",
      vetTimeSlotId: item.vetTimeSlotId,
      lastDate: item.lastDate ? item.lastDate.split("T")[0] : "",
      nextDate: item.nextDate ? item.nextDate.split("T")[0] : "",
    });
  }, [item, open, reset]);

  const fieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontSize: scaleFont(14, settings?.textSize),
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
      !values.vaccineType ||
      !values.vetCabinetId ||
      !values.vetTimeSlotId
    ) {
      return;
    }

    updateVaccinationMutation.mutate(
      {
        vaccinationId: item.id,
        payload: {
          animalId: Number(values.animalId),
          vaccineType: Number(values.vaccineType),
          vetCabinetId: Number(values.vetCabinetId),
          vetTimeSlotId: Number(values.vetTimeSlotId),
          lastDate: values.lastDate
            ? `${values.lastDate}T00:00:00.000Z`
            : undefined,
          nextDate: values.nextDate
            ? `${values.nextDate}T00:00:00.000Z`
            : undefined,
        },
      },
      {
        onSuccess: (updated) => {
          const selectedSlot = slotOptions.find(
            (slot) => slot.id === Number(values.vetTimeSlotId)
          );

          const selectedCabinet = cabinets.find(
            (cabinet) => cabinet.id === Number(values.vetCabinetId)
          );

          queryClient.setQueryData<VaccinationCacheItem[]>(
            ["vaccinations"],
            (old) => {
              if (!old) return old;

              return old.map((vaccination) =>
                vaccination.id === item.id
                  ? {
                      ...vaccination,
                      ...updated,

                      animalId: Number(values.animalId),
                      vaccineType: Number(values.vaccineType),

                      vetCabinetId: Number(values.vetCabinetId),
                      vetCabinetName:
                        selectedCabinet?.name ??
                        updated.vetCabinetName ??
                        vaccination.vetCabinetName,

                      vetTimeSlotId: Number(values.vetTimeSlotId),

                      lastDate:
                        values.lastDate
                          ? `${values.lastDate}T00:00:00.000Z`
                          : selectedSlot?.startTimeUtc ??
                            updated.lastDate ??
                            vaccination.lastDate,

                      lastDateUtc:
                        values.lastDate
                          ? `${values.lastDate}T00:00:00.000Z`
                          : selectedSlot?.startTimeUtc ??
                            updated.lastDateUtc ??
                            updated.lastDate ??
                            vaccination.lastDateUtc,

                      nextDate:
                        values.nextDate
                          ? `${values.nextDate}T00:00:00.000Z`
                          : updated.nextDate ?? vaccination.nextDate,

                      nextDateUtc:
                        values.nextDate
                          ? `${values.nextDate}T00:00:00.000Z`
                          : updated.nextDateUtc ??
                            updated.nextDate ??
                            vaccination.nextDateUtc,

                      slotStartTimeUtc:
                        selectedSlot?.startTimeUtc ??
                        updated.slotStartUtc ??
                        updated.slotStartTimeUtc ??
                        vaccination.slotStartTimeUtc,

                      slotStartUtc:
                        selectedSlot?.startTimeUtc ??
                        updated.slotStartUtc ??
                        updated.slotStartTimeUtc ??
                        vaccination.slotStartUtc,

                      slotEndTimeUtc:
                        selectedSlot?.endTimeUtc ??
                        updated.slotEndUtc ??
                        updated.slotEndTimeUtc ??
                        vaccination.slotEndTimeUtc,

                      slotEndUtc:
                        selectedSlot?.endTimeUtc ??
                        updated.slotEndUtc ??
                        updated.slotEndTimeUtc ??
                        vaccination.slotEndUtc,
                    }
                  : vaccination
              );
            }
          );

          enqueueSnackbar(t("vaccination:updateSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          queryClient.invalidateQueries({ queryKey: ["vetAvailability"] });
          queryClient.invalidateQueries({
            queryKey: ["vaccinationAvailability"],
          });

          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("vaccination:updateError"), {
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
          })}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
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
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
                }}
              >
                <VaccinesRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  })}
                >
                  {t("vaccination:editDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                  })}
                >
                  {t("vaccination:editDialogSubtitle")}
                </Typography>
              </Box>
            </Stack>

            <IconButton onClick={onClose} size="small">
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider />
      </DialogTitle>

      <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography sx={labelSx}>{t("vaccination:pet")}</Typography>
            <Controller
              name="animalId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("vaccination:selectPet")}
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
            <Typography sx={labelSx}>{t("vaccination:vaccineType")}</Typography>
            <Controller
              name="vaccineType"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("vaccination:selectVaccineType")}
                  </MenuItem>
                  {vaccineTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("vaccination:vetCabinet")}</Typography>
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
                    {t("vaccination:selectVetCabinet")}
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
                {t("vaccination:estimatedPrice")}
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
            <Typography sx={labelSx}>{t("vaccination:visitDate")}</Typography>
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
            <Typography sx={labelSx}>{t("vaccination:timeSlot")}</Typography>
            <Controller
              name="vetTimeSlotId"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth select sx={fieldSx}>
                  <MenuItem value="" disabled>
                    {t("vaccination:selectTimeSlot")}
                  </MenuItem>
                  {slotOptions.map((slot) => (
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>{t("vaccination:lastDate")}</Typography>
              <Controller
                name="lastDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" fullWidth sx={fieldSx} />
                )}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>{t("vaccination:nextDate")}</Typography>
              <Controller
                name="nextDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" fullWidth sx={fieldSx} />
                )}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 0.5 }} />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="button"
              fullWidth
              onClick={onClose}
              sx={(theme) => ({
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.05)
                    : "rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.08)
                    : "rgba(0,0,0,0.07)",
                  color: theme.palette.text.primary,
                },
              })}
            >
              {t("vaccination:cancel")}
            </Button>

            <LoadingButton
              type="submit"
              loading={updateVaccinationMutation.isPending}
              variant="contained"
              fullWidth
              sx={{
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(14, settings?.textSize),
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
              {t("vaccination:saveChanges")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};