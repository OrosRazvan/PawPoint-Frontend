import { useEffect } from "react";
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
  Grid,
  Button,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import {
  useForm,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  createAnimalSchema,
  type CreateAnimalFormInput,
  type CreateAnimalFormValues,
} from "../../../types/createAnimalSchema";
import { useUpdateAnimal } from "../../../hooks/useUpdateAnimal";
import type { DashboardPet } from "../types/dashboard";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";

type Props = {
  open: boolean;
  onClose: () => void;
  pet: DashboardPet | null;
};

export const EditPetDialog = ({ open, onClose, pet }: Props) => {
  const { t } = useTranslation(["dashboard"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateAnimalMutation = useUpdateAnimal();
  const { data: settings } = useSettings();

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      fontSize: scaleFont(14, settings?.textSize),
      transition: "box-shadow 0.2s ease",
      "& fieldset": {
        borderColor: "#e8e2d9",
      },
      "&:hover fieldset": {
        borderColor: "#f5a623",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f5a623",
        borderWidth: 1.5,
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(245,166,35,0.12)",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#aaa",
      opacity: 1,
      fontSize: scaleFont(14, settings?.textSize),
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      fontSize: scaleFont(12, settings?.textSize),
    },
  };

  const labelSx = {
    fontSize: scaleFont(12, settings?.textSize),
    fontWeight: 600,
    color: "#6b7280",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    mb: 0.6,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnimalFormInput, unknown, CreateAnimalFormValues>({
    resolver: zodResolver(createAnimalSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      weightKg: undefined,
      birthDate: "",
      sex: "",
      microchipNumber: "",
    },
  });

  useEffect(() => {
    if (!pet || !open) return;

    reset({
      name: pet.name ?? "",
      species: pet.species ?? "",
      breed: pet.breed ?? "",
      weightKg: pet.weightKg ?? undefined,
      birthDate: pet.birthDate ? pet.birthDate.split("T")[0] : "",
      sex: pet.sex ?? "",
      microchipNumber: pet.microchipNumber ?? "",
    });
  }, [pet, open, reset]);

  const onSubmit: SubmitHandler<CreateAnimalFormValues> = (values) => {
    if (!pet) return;

    updateAnimalMutation.mutate(
      {
        animalId: Number(pet.id),
        payload: {
          name: values.name.trim(),
          species: values.species.trim(),
          breed: values.breed?.trim() || undefined,
          weightKg: values.weightKg,
          birthDate: values.birthDate
            ? `${values.birthDate}T00:00:00.000Z`
            : undefined,
          sex: values.sex || undefined,
          microchipNumber: values.microchipNumber?.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("dashboard:updatePetSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("dashboard:updatePetError"), {
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
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#faf8f5",
          boxShadow:
            "0 24px 64px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 2.5,
            background: "linear-gradient(135deg, #fbf2ea 0%, #fdf7ef 100%)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(245,166,35,0.08)",
              pointerEvents: "none",
            },
          }}
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
                <PetsRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: "#071c42",
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {t("dashboard:editPetDialogTitle")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(13, settings?.textSize),
                    color: "#8a95a3",
                    mt: 0.4,
                    fontWeight: 400,
                  }}
                >
                  {t("dashboard:editPetDialogSubtitle")}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "#9ca3af",
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: 2,
                width: 32,
                height: 32,
                mt: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.08)",
                  color: "#4b5563",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ede8e0" }} />
      </DialogTitle>

      <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
        <Stack component="form" spacing={0} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2, pt: 0.4 }}>
            <Typography sx={labelSx}>{t("dashboard:petName")}</Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder={t("dashboard:petName")}
                  error={!!errors.name}
                  helperText={
                    errors.name?.message
                      ? t(`dashboard:${errors.name.message}`)
                      : ""
                  }
                  fullWidth
                  sx={fieldSx}
                />
              )}
            />
          </Box>

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 7 }}>
              <Typography sx={labelSx}>{t("dashboard:species")}</Typography>
              <Controller
                name="species"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.species}
                    helperText={
                      errors.species?.message
                        ? t(`dashboard:${errors.species.message}`)
                        : ""
                    }
                    fullWidth
                    select
                    SelectProps={{ displayEmpty: true }}
                    sx={fieldSx}
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        fontSize: scaleFont(14, settings?.textSize),
                        color: "#aaa",
                      }}
                    >
                      {t("dashboard:species")}
                    </MenuItem>
                    <MenuItem value="Dog">{t("dashboard:dog")}</MenuItem>
                    <MenuItem value="Cat">{t("dashboard:cat")}</MenuItem>
                    <MenuItem value="Bird">{t("dashboard:bird")}</MenuItem>
                    <MenuItem value="Rabbit">{t("dashboard:rabbit")}</MenuItem>
                    <MenuItem value="Other">{t("dashboard:other")}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 5 }}>
              <Typography sx={labelSx}>{t("dashboard:sex")}</Typography>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{ displayEmpty: true }}
                    sx={fieldSx}
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        fontSize: scaleFont(14, settings?.textSize),
                        color: "#aaa",
                      }}
                    >
                      {t("dashboard:sex")}
                    </MenuItem>
                    <MenuItem value="Male">{t("dashboard:male")}</MenuItem>
                    <MenuItem value="Female">{t("dashboard:female")}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Typography sx={labelSx}>{t("dashboard:breed")}</Typography>
            <Controller
              name="breed"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder={t("dashboard:breed")}
                  fullWidth
                  sx={fieldSx}
                />
              )}
            />
          </Box>

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 5 }}>
              <Typography sx={labelSx}>{t("dashboard:weightKg")}</Typography>
              <Controller
                name="weightKg"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: 0.1 }}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="0.0"
                    sx={fieldSx}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Typography sx={labelSx}>{t("dashboard:birthDate")}</Typography>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography sx={labelSx}>{t("dashboard:microchipNumber")}</Typography>
            <Controller
              name="microchipNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder={t("dashboard:microchipNumber")}
                  fullWidth
                  sx={fieldSx}
                />
              )}
            />
          </Box>

          <Divider sx={{ borderColor: "#ede8e0", mb: 2.5 }} />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="button"
              fullWidth
              onClick={onClose}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(15, settings?.textSize),
                color: "#4b5563",
                backgroundColor: "#f0f2f7",
                "&:hover": {
                  backgroundColor: "#e4e8f0",
                },
              }}
            >
              {t("dashboard:cancel")}
            </Button>

            <LoadingButton
              type="submit"
              loading={isSubmitting || updateAnimalMutation.isPending}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(15, settings?.textSize),
                letterSpacing: "-0.1px",
                background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(245,166,35,0.4)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                  boxShadow: "0 6px 18px rgba(245,166,35,0.45)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(245,166,35,0.3)",
                },
              }}
            >
              {t("dashboard:saveChanges")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};