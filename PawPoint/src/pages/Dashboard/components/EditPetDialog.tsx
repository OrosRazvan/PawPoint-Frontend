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
  Checkbox,
  FormControlLabel,
  Slider,
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
import { useQueryClient } from "@tanstack/react-query";
import Cropper, { type Area } from "react-easy-crop";

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

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImageFile = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName = "pet-image.jpg"
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Crop failed"));
          return;
        }

        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
};

export const EditPetDialog = ({ open, onClose, pet }: Props) => {
  const { t } = useTranslation(["dashboard"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateAnimalMutation = useUpdateAnimal();
  const { data: settings } = useSettings();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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

    setSelectedImage(null);
    setRemoveImage(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }, [pet, open, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      enqueueSnackbar(t("dashboard:imageTypeError"), {
        variant: "error",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      enqueueSnackbar(t("dashboard:imageSizeError"), {
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
    setRemoveImage(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    event.target.value = "";
  };

  const displayedImage = previewUrl || (!removeImage ? pet?.imageUrl : "") || "";

  const onSubmit: SubmitHandler<CreateAnimalFormValues> = async (values) => {
    if (!pet) return;

    let imageToUpload: File | null = null;

    try {
      if (selectedImage && previewUrl && croppedAreaPixels && !removeImage) {
        imageToUpload = await getCroppedImageFile(
          previewUrl,
          croppedAreaPixels,
          `pet-${pet.id}.jpg`
        );
      }
    } catch {
      enqueueSnackbar(t("dashboard:imageCropError"), {
        variant: "error",
      });
      return;
    }

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
          image: imageToUpload,
          removeImage,
          imagePositionY: 50,
        },
      },
      {
        onSuccess: async () => {
          enqueueSnackbar(t("dashboard:updatePetSuccess"), {
            variant: "success",
          });

          await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
          await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          await queryClient.invalidateQueries({ queryKey: ["animals"] });

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
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #f5a623 0%, #f0911a 100%)",
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
                  })}
                >
                  {t("dashboard:editPetDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                  })}
                >
                  {t("dashboard:editPetDialogSubtitle")}
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
        <Stack component="form" spacing={0} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography sx={labelSx}>{t("dashboard:petImage")}</Typography>

            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  position: "relative",
                  width: 240,
                  height: 240,
                  borderRadius: "32px",
                  overflow: "hidden",
                  backgroundColor: "#111",
                  boxShadow: "0 14px 32px rgba(245,166,35,0.18)",
                }}
              >
                {displayedImage ? (
                  <Cropper
                    image={displayedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="rect"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedPixels: Area) =>
                      setCroppedAreaPixels(croppedPixels)
                    }
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 2,
                    }}
                  >
                    <Typography
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        textAlign: "center",
                        fontSize: scaleFont(14, settings?.textSize),
                      })}
                    >
                      {t("dashboard:noImageSelected")}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  component="label"
                  startIcon={<PhotoCameraOutlinedIcon />}
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#f5a623",
                    borderColor: "rgba(245,166,35,0.45)",
                    px: 2.5,
                    py: 1,
                  }}
                >
                  {t("dashboard:uploadImage")}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                </Button>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={removeImage}
                      onChange={(e) => {
                        setRemoveImage(e.target.checked);

                        if (e.target.checked) {
                          setSelectedImage(null);
                          setCrop({ x: 0, y: 0 });
                          setZoom(1);
                          setCroppedAreaPixels(null);

                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl("");
                          }
                        }
                      }}
                    />
                  }
                  label={t("dashboard:removeImage")}
                />
              </Stack>

              <Box sx={{ width: "100%" }}>
                <Typography sx={labelSx}>{t("dashboard:zoom")}</Typography>

                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(_, value) => setZoom(value as number)}
                  sx={{
                    color: "#f5a623",
                    "& .MuiSlider-thumb": {
                      width: 24,
                      height: 24,
                      boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
                    },
                    "& .MuiSlider-track": {
                      height: 5,
                      border: "none",
                    },
                    "& .MuiSlider-rail": {
                      height: 5,
                      opacity: 0.35,
                    },
                  }}
                />

                <Typography
                  sx={{
                    mt: 0.8,
                    fontSize: 12,
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {t("dashboard:imageCropHint")}
                </Typography>
              </Box>
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
                    SPECIES_OPTIONS.find((option) => option.value === field.value) ??
                    null;

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
                          const translatedLabel = t(
                            `dashboard:${option.labelKey}`
                          ).toLowerCase();
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

          <Stack direction="row" spacing={1.5}>
            <Button type="button" fullWidth onClick={onClose}>
              {t("dashboard:cancel")}
            </Button>

            <LoadingButton
              type="submit"
              loading={isSubmitting || updateAnimalMutation.isPending}
              variant="contained"
              fullWidth
            >
              {t("dashboard:saveChanges")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};