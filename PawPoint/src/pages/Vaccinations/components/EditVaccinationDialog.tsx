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

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",
      fontSize: scaleFont(14, settings?.textSize),
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
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#faf8f5",
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
          }}
        >
          <Stack direction="row" justifyContent="space-between">
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
                }}
              >
                <VaccinesRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: "#071c42",
                  }}
                >
                  {t("vaccination:editDialogTitle")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(13, settings?.textSize),
                    color: "#8a95a3",
                    mt: 0.4,
                  }}
                >
                  {t("vaccination:editDialogSubtitle")}
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
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ede8e0" }} />
      </DialogTitle>

      <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography sx={labelSx}>{t("vaccination:vaccineName")}</Typography>
            <Controller
              name="vaccineName"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth sx={fieldSx} />}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("vaccination:lastDate")}</Typography>
            <Controller
              name="lastDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" fullWidth sx={fieldSx} />
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("vaccination:nextDate")}</Typography>
            <Controller
              name="nextDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" fullWidth sx={fieldSx} />
              )}
            />
          </Box>

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

          <Divider sx={{ borderColor: "#ede8e0", mt: 1, mb: 1 }} />

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
              }}
            >
              {t("vaccination:cancel")}
            </Button>

            <LoadingButton
              type="submit"
              loading={updateVaccinationMutation.isPending}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(15, settings?.textSize),
                background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                color: "#fff",
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