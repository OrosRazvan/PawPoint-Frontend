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
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateDeworming } from "../../../hooks/useUpdateDeworming";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { DewormingCardItem } from "../types/deworming";
import { DewormingTypeEnum } from "../types/deworming";

type Props = {
  open: boolean;
  item: DewormingCardItem | null;
  onClose: () => void;
};

type FormValues = {
  type: DewormingTypeEnum | "";
  intervalDays: number | "";
  notes: string;
};

const normalizeType = (
  value: string | number
): DewormingTypeEnum | "" => {
  if (typeof value === "number") {
    switch (value) {
      case 1:
        return DewormingTypeEnum.Internal;
      case 2:
        return DewormingTypeEnum.External;
      case 3:
        return DewormingTypeEnum.Combined;
      case 4:
        return DewormingTypeEnum.Control;
      default:
        return "";
    }
  }

  if (typeof value === "string") {
    switch (value.toLowerCase()) {
      case "internal":
        return DewormingTypeEnum.Internal;
      case "external":
        return DewormingTypeEnum.External;
      case "combined":
        return DewormingTypeEnum.Combined;
      case "control":
        return DewormingTypeEnum.Control;
      default:
        return "";
    }
  }

  return "";
};

export const EditDewormingDialog = ({ open, item, onClose }: Props) => {
  const { t } = useTranslation(["deworming"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateDewormingMutation = useUpdateDeworming();
  const { data: settings } = useSettings();

  const dewormingTypes = [
    { value: 1, label: t("deworming:typeInternal") },
    { value: 2, label: t("deworming:typeExternal") },
    { value: 3, label: t("deworming:typeCombined") },
    { value: 4, label: t("deworming:typeControl") },
  ];

  const fieldSx = (theme: any) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      fontSize: scaleFont(14, settings?.textSize),
      color: theme.palette.text.primary,
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
      type: "",
      intervalDays: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!item || !open) return;

    reset({
      type: normalizeType(item.type),
      intervalDays: item.intervalDays ?? "",
      notes: item.notes ?? "",
    });
  }, [item, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!item || !values.type || !values.intervalDays) return;

    updateDewormingMutation.mutate(
      {
        dewormingId: item.id,
        payload: {
          type: values.type,
          intervalDays: Number(values.intervalDays),
          notes: values.notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t("deworming:updateSuccess"), {
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["dewormings"] });
          queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
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
              : undefined,
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
          })}
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
                <BugReportOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                  })}
                >
                  {t("deworming:editDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
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
            <Typography sx={labelSx}>{t("deworming:intervalDays")}</Typography>
            <Controller
              name="intervalDays"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  sx={fieldSx}
                  inputProps={{ min: 1 }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>{t("deworming:notes")}</Typography>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth multiline minRows={3} sx={fieldSx} />
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
                background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                color: "#fff",
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