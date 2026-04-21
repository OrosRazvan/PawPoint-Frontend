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
          lastDate: values.lastDate ? `${values.lastDate}T00:00:00.000Z` : undefined,
          nextDate: values.nextDate ? `${values.nextDate}T00:00:00.000Z` : undefined,
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
              : "0 20px 60px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
        }),
      }}
    >
      {/* Amber accent strip */}
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #f5a623, #f8c471)",
        }}
      />

      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 2.75, pb: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #f5a623 0%, #f0911a 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(245,166,35,0.36)",
                  flexShrink: 0,
                }}
              >
                <VaccinesRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(18, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  })}
                >
                  {t("vaccination:editDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(12.5, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.35,
                  })}
                >
                  {t("vaccination:editDialogSubtitle")}
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
                width: 30,
                height: 30,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "rgba(0,0,0,0.08)",
                  color: theme.palette.text.primary,
                },
              })}
            >
              <CloseRoundedIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider />
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: "24px !important", pb: 3 }}>
        <Stack component="form" spacing={2.25} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography sx={labelSx}>{t("vaccination:vaccineName")}</Typography>
            <Controller
              name="vaccineName"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth sx={fieldSx} />}
            />
          </Box>

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
                <TextField {...field} fullWidth multiline minRows={3} sx={fieldSx} />
              )}
            />
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="button"
              fullWidth
              onClick={onClose}
              sx={(theme) => ({
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.06)
                    : "#f0f2f7",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "#e8ecf3",
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
                background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                color: "#fff",
                boxShadow: "0 6px 16px rgba(245,166,35,0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #f0a020 0%, #e08510 100%)",
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