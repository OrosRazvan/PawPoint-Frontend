import { useEffect, useState } from "react";
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
  Autocomplete,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import {
  useForm,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import {
  createAnimalSchema,
  type CreateAnimalFormInput,
  type CreateAnimalFormValues,
} from "../../../types/createAnimalSchema";
import { useCreateAnimal } from "../../../hooks/useCreateAnimal";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const SPECIES_OPTIONS = [
  { value: "Dog", labelKey: "dog" },
  { value: "Cat", labelKey: "cat" },
  { value: "Bird", labelKey: "bird" },
  { value: "Rabbit", labelKey: "rabbit" },
  { value: "Snake", labelKey: "snake" },
  { value: "Hamster", labelKey: "hamster" },
  { value: "Fish", labelKey: "fish" },
  { value: "Turtle", labelKey: "turtle" },
  { value: "Guinea Pig", labelKey: "guineaPig" },
  { value: "Ferret", labelKey: "ferret" },
  { value: "Parrot", labelKey: "parrot" },
  { value: "Canary", labelKey: "canary" },
  { value: "Lizard", labelKey: "lizard" },
  { value: "Gecko", labelKey: "gecko" },
  { value: "Iguana", labelKey: "iguana" },
  { value: "Chinchilla", labelKey: "chinchilla" },
  { value: "Hedgehog", labelKey: "hedgehog" },
  { value: "Mouse", labelKey: "mouse" },
  { value: "Rat", labelKey: "rat" },
  { value: "Horse", labelKey: "horse" },
  { value: "Pony", labelKey: "pony" },
  { value: "Goat", labelKey: "goat" },
  { value: "Pig", labelKey: "pig" },
  { value: "Chicken", labelKey: "chicken" },
  { value: "Duck", labelKey: "duck" },
  { value: "Goose", labelKey: "goose" },
  { value: "Sheep", labelKey: "sheep" },
  { value: "Cow", labelKey: "cow" },
  { value: "Other", labelKey: "other" },
];

export const AddPetDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation(["dashboard"]);
  const { enqueueSnackbar } = useSnackbar();
  const createAnimalMutation = useCreateAnimal();
  const queryClient = useQueryClient();
  const { data: settings } = useSettings();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
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
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
      "&.Mui-focused": {
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
            : "0 0 0 3px rgba(245,166,35,0.12)",
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
    if (!open) {
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
    }
  }, [open, previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      enqueueSnackbar("Poți încărca doar JPG, PNG sau WEBP.", {
        variant: "error",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      enqueueSnackbar(`Imaginea trebuie să aibă maxim ${MAX_IMAGE_SIZE_MB} MB.`, {
        variant: "error",
      });
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewUrl(localPreviewUrl);
    event.target.value = "";
  };

  const onSubmit: SubmitHandler<CreateAnimalFormValues> = (values) => {
    createAnimalMutation.mutate(
      {
        name: values.name.trim(),
        species: values.species.trim(),
        breed: values.breed?.trim() || undefined,
        weightKg: values.weightKg,
        birthDate: values.birthDate
          ? new Date(`${values.birthDate}T00:00:00Z`).toISOString()
          : undefined,
        sex: values.sex || undefined,
        microchipNumber: values.microchipNumber?.trim() || undefined,
        image: selectedImage,
      },
      {
        onSuccess: async () => {
          enqueueSnackbar(t("dashboard:addPetSuccess"), {
            variant: "success",
          });

          await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          await queryClient.invalidateQueries({ queryKey: ["animals"] });

          reset();
          setSelectedImage(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl("");
          onClose();
        },
        onError: () => {
          enqueueSnackbar(t("dashboard:addPetError"), {
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
              bottom: 0,
              right: -20,
              width: 120,
              height: 120,
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
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  })}
                >
                  {t("dashboard:addPetDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("dashboard:addPetDialogSubtitle")}
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
        <Stack component="form" spacing={0} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={labelSx}>Poză animal</Typography>

            <Stack spacing={1.5} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: "100%",
                  height: 180,
                  borderRadius: 3,
                  border: `1px dashed ${theme.palette.divider}`,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.03)
                      : "#faf7f2",
                })}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    sx={(theme) => ({
                      color: theme.palette.text.secondary,
                      fontSize: scaleFont(14, settings?.textSize),
                    })}
                  >
                    Nu ai selectat nicio imagine
                  </Typography>
                )}
              </Box>

              <Button
                component="label"
                startIcon={<PhotoCameraOutlinedIcon />}
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Alege poză
                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />
              </Button>
            </Stack>
          </Box>

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
                render={({ field }) => {
                  const selectedOption =
                    SPECIES_OPTIONS.find((option) => option.value === field.value) ?? null;

                  return (
                    <Autocomplete
                      freeSolo
                      options={SPECIES_OPTIONS}
                      value={selectedOption}
                      inputValue={field.value ?? ""}
                      getOptionLabel={(option) =>
                        typeof option === "string"
                          ? option
                          : t(`dashboard:${option.labelKey}`)
                      }
                      filterOptions={(options, state) => {
                        const input = state.inputValue.trim().toLowerCase();

                        if (!input) return options;

                        return options.filter((option) => {
                          const translatedLabel = t(`dashboard:${option.labelKey}`).toLowerCase();
                          const rawValue = option.value.toLowerCase();

                          return (
                            translatedLabel.includes(input) ||
                            rawValue.includes(input)
                          );
                        });
                      }}
                      onInputChange={(_, value) => {
                        field.onChange(value);
                      }}
                      onChange={(_, value) => {
                        if (typeof value === "string") {
                          field.onChange(value);
                          return;
                        }

                        field.onChange(value?.value ?? "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("dashboard:species")}
                          error={!!errors.species}
                          helperText={
                            errors.species?.message
                              ? t(`dashboard:${errors.species.message}`)
                              : ""
                          }
                          fullWidth
                          sx={fieldSx}
                        />
                      )}
                    />
                  );
                }}
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
                    <MenuItem value="" disabled>
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

          <Divider sx={{ mb: 2.5 }} />

          <LoadingButton
            type="submit"
            loading={isSubmitting || createAnimalMutation.isPending}
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
              "&:hover": {
                background:
                  "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
              },
            }}
          >
            {t("dashboard:savePet")}
          </LoadingButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};