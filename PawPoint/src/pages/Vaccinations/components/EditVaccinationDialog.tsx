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
  Box,
  Divider,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateVaccination } from "../../../hooks/useUpdateVaccination";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { VaccinationCardItem } from "../types/vaccination";

type Props = {
  open: boolean;
  item: VaccinationCardItem | null;
  onClose: () => void;
};

type FormValues = {
  vaccineName: string;
  lastDate: string;
  nextDate: string;
  notes: string;
};

export const EditVaccinationDialog = ({ open, item, onClose }: Props) => {
  const { t } = useTranslation(["vaccination"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateVaccinationMutation = useUpdateVaccination();
  const { data: settings } = useSettings();

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

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      vaccineName: "",
      lastDate: "",
      nextDate: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!item || !open) return;

    reset({
      vaccineName: item.vaccineName ?? "",
      lastDate: item.lastDate ? item.lastDate.split("T")[0] : "",
      nextDate: item.nextDate ? item.nextDate.split("T")[0] : "",
      notes: item.notes ?? "",
    });
  }, [item, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!item) return;

    updateVaccinationMutation.mutate(
      {
        vaccinationId: item.id,
        payload: {
          vaccineName: values.vaccineName.trim(),
          lastDate: values.lastDate
            ? `${values.lastDate}T00:00:00.000Z`
            : undefined,
          nextDate: values.nextDate
            ? `${values.nextDate}T00:00:00.000Z`
            : undefined,
          notes: values.notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("vaccination:updateSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
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
        <Stack component="form" spacing={0} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={labelSx}>{t("vaccination:vaccineName")}</Typography>
            <Controller
              name="vaccineName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth sx={fieldSx} />
              )}
            />
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
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

          <Box sx={{ mb: 2.5 }}>
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

          <Divider sx={{ mb: 2.5 }} />

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