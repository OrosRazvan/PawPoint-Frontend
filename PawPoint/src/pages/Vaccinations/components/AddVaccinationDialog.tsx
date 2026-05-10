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
  MenuItem,
  Box,
  Divider,
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
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCreateVaccination } from "../../../hooks/useCreateVaccination";
import { useVaccinations } from "../../../hooks/useVaccinations";
import { getAnimals } from "../../../api/getAnimal";
import { useVetCabinets } from "../../../hooks/useVetCabinets";
import { useVetAvailability } from "../../../hooks/useVetAvailability";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type {
  VaccinationDto,
  VaccinationFormValues,
} from "../types/vaccination";

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

const getComparableDate = (item: VaccinationDto) => {
  const value = item.nextDate ?? item.lastDate ?? "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const AddVaccinationDialog = ({ open, onClose }: Props) => {
  const { t, i18n } = useTranslation(["vaccination"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const createVaccinationMutation = useCreateVaccination();
  const { data: settings } = useSettings();
  const locale = i18n.language === "ro" ? "ro-RO" : "en-GB";

  const dateFormat: AppDateFormat = settings?.dateFormat ?? "DD/MM/YYYY";

  const fieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontSize: scaleFont(14, settings?.textSize),
      transition: "box-shadow 0.15s ease",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused": {
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
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
    fontSize: scaleFont(11.5, settings?.textSize),
    fontWeight: 700,
    color: theme.palette.text.secondary,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    mb: 0.75,
  });

  const { data: animals = [] } = useQuery({
    queryKey: ["animals"],
    queryFn: getAnimals,
    enabled: open,
  });

  const { data: cabinets = [] } = useVetCabinets(open);
  const { data: vaccinations = [] } = useVaccinations();

  const { control, handleSubmit, reset, setValue } =
    useForm<VaccinationFormValues>({
      defaultValues: {
        animalId: "",
        vaccineName: "",
        vetCabinetId: "",
        visitDate: "",
        vetTimeSlotId: "",
        lastDate: "",
        nextDate: "",
        notes: "",
      },
    });

  const selectedAnimalId = useWatch({ control, name: "animalId" });
  const selectedVaccineName = useWatch({ control, name: "vaccineName" });
  const selectedCabinetId = useWatch({ control, name: "vetCabinetId" });
  const selectedVisitDate = useWatch({ control, name: "visitDate" });
  const currentLastDate = useWatch({ control, name: "lastDate" });
  const currentNextDate = useWatch({ control, name: "nextDate" });

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

  const matchingPreviousVaccination = useMemo(() => {
    if (!selectedAnimalId || !selectedVaccineName.trim()) return null;

    const filtered = vaccinations
      .filter(
        (item) =>
          item.animalId === Number(selectedAnimalId) &&
          item.vaccineName.trim().toLowerCase() ===
            selectedVaccineName.trim().toLowerCase()
      )
      .sort((a, b) => getComparableDate(b) - getComparableDate(a));

    return filtered[0] ?? null;
  }, [vaccinations, selectedAnimalId, selectedVaccineName]);

  useEffect(() => {
    if (!open) return;
    if (!matchingPreviousVaccination) return;

    if (!currentLastDate) {
      setValue(
        "lastDate",
        matchingPreviousVaccination.lastDate
          ? matchingPreviousVaccination.lastDate.split("T")[0]
          : ""
      );
    }

    if (!currentNextDate) {
      setValue(
        "nextDate",
        matchingPreviousVaccination.nextDate
          ? matchingPreviousVaccination.nextDate.split("T")[0]
          : ""
      );
    }
  }, [
    open,
    matchingPreviousVaccination,
    currentLastDate,
    currentNextDate,
    setValue,
  ]);

  const onSubmit: SubmitHandler<VaccinationFormValues> = (values) => {
    if (!values.animalId || !values.vetCabinetId || !values.vetTimeSlotId) {
      return;
    }

    createVaccinationMutation.mutate(
      {
        animalId: Number(values.animalId),
        vaccineName: values.vaccineName.trim(),
        vetCabinetId: Number(values.vetCabinetId),
        vetTimeSlotId: Number(values.vetTimeSlotId),
        lastDate: values.lastDate
          ? `${values.lastDate}T00:00:00.000Z`
          : undefined,
        nextDate: values.nextDate
          ? `${values.nextDate}T00:00:00.000Z`
          : undefined,
        notes: values.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("vaccination:addSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

          reset();
          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("vaccination:addError"), {
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
              : "0 20px 60px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
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
                <VaccinesRoundedIcon sx={{ fontSize: 22 }} />
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
                  {t("vaccination:addDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("vaccination:addDialogSubtitle")}
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

      <DialogContent sx={{ px: 3, pt: "24px !important", pb: 3 }}>
        <Stack component="form" spacing={2.25} onSubmit={handleSubmit(onSubmit)}>
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
            <Typography sx={labelSx}>{t("vaccination:vaccineName")}</Typography>
            <Controller
              name="vaccineName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth sx={fieldSx} />
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
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

            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>{t("vaccination:timeSlot")}</Typography>
              <Controller
                name="vetTimeSlotId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth select sx={fieldSx}>
                    <MenuItem value="" disabled>
                      {t("vaccination:selectTimeSlot")}
                    </MenuItem>
                    {Array.isArray(slots) &&
                      slots.map((slot) => (
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
              {Array.isArray(slots) &&
                slots.length === 0 &&
                selectedCabinetId &&
                selectedVisitDate && (
                  <Typography
                    sx={(theme) => ({
                      mt: 0.75,
                      fontSize: scaleFont(12, settings?.textSize),
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.warning.main
                          : "#b45309",
                    })}
                  >
                    {t("vaccination:noSlotsAvailable")}
                  </Typography>
                )}
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

          <Box>
            <Typography sx={labelSx}>{t("vaccination:notes")}</Typography>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={3}
                  sx={fieldSx}
                />
              )}
            />
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <LoadingButton
            type="submit"
            loading={createVaccinationMutation.isPending}
            variant="contained"
            fullWidth
            sx={{
              py: 1.45,
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
            {t("vaccination:save")}
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};