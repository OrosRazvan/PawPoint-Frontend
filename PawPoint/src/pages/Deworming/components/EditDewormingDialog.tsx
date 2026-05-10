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

const normalizeType = (value: string | number): DewormingTypeEnum | "" => {
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
      borderRadius: 2.5,
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha("#ffffff", 0.03)
          : theme.palette.background.paper,
      fontSize: scaleFont(14, settings?.textSize),
      color: theme.palette.text.primary,
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
                <BugReportOutlinedIcon sx={{ fontSize: 22 }} />
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
                  {t("deworming:editDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
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
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "#e5e7ee",
                  color: theme.palette.text.primary,
                },
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
              {t("deworming:saveChanges")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};