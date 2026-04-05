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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateDeworming } from "../../../hooks/useUpdateDeworming";
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

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "#fff",
    fontSize: 14,
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
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  mb: 0.6,
};

const dewormingTypes = [
  { value: 1, label: "Internal" },
  { value: 2, label: "External" },
  { value: 3, label: "Combined" },
  { value: 4, label: "Control" },
];

const normalizeType = (value: DewormingCardItem["type"]): DewormingTypeEnum | "" => {
  if (typeof value === "string") {
    if (dewormingTypes.some((type) => type.label === value)) {
      return value as DewormingTypeEnum;
    }
    return "";
  }

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
};

export const EditDewormingDialog = ({ open, item, onClose }: Props) => {
  const { t } = useTranslation(["deworming"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const updateDewormingMutation = useUpdateDeworming();

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
                <BugReportOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 19, fontWeight: 800, color: "#071c42" }}>
                  {t("deworming:editDialogTitle")}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#8a95a3", mt: 0.4 }}>
                  {t("deworming:editDialogSubtitle")}
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
                fontSize: 15,
                color: "#4b5563",
                backgroundColor: "#f0f2f7",
              }}
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
                fontSize: 15,
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