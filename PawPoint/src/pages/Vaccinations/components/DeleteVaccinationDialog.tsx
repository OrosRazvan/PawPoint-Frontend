import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteVaccination } from "../../../hooks/useDeleteVaccination";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { VaccinationCardItem } from "../types/vaccination";

type Props = {
  open: boolean;
  item: VaccinationCardItem | null;
  onClose: () => void;
};

export const DeleteVaccinationDialog = ({ open, item, onClose }: Props) => {
  const { t } = useTranslation(["vaccination"]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteVaccinationMutation = useDeleteVaccination();
  const { data: settings } = useSettings();

  const handleDelete = () => {
    if (!item) return;

    deleteVaccinationMutation.mutate(item.id, {
      onSuccess: () => {
        enqueueSnackbar(t("vaccination:deleteSuccess"), {
          variant: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

        onClose();
      },
      onError: () => {
        enqueueSnackbar(t("vaccination:deleteError"), {
          variant: "error",
        });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
                    theme.palette.error.main,
                    0.14
                  )} 0%, ${alpha(
                    theme.palette.background.paper,
                    0.96
                  )} 100%)`
                : "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
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
                  ? alpha(theme.palette.error.main, 0.12)
                  : "rgba(229,53,53,0.07)",
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
                    "linear-gradient(135deg, #e53535 0%, #c62828 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(229,53,53,0.32)",
                  flexShrink: 0,
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 23 }} />
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
                  {t("vaccination:deleteDialogTitle")}
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("vaccination:deleteDialogSubtitle")}
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

      <DialogContent sx={{ px: 3.5, pt: "24px !important", pb: 1.5 }}>
        <Stack spacing={2.25}>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 2,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.1)
                  : "#fff5f5",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.22)
                  : "rgba(229,53,53,0.14)"
              }`,
            })}
          >
            <WarningAmberRoundedIcon
              sx={(theme) => ({
                color: theme.palette.error.main,
                fontSize: 22,
                mt: 0.1,
                flexShrink: 0,
              })}
            />

            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.primary,
                lineHeight: 1.55,
              })}
            >
              {t("vaccination:deleteDialogTitle", {
                name: item?.vaccineName ?? "",
              })}
            </Typography>
          </Box>

          {item && (
            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.03)
                    : theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(12, settings?.textSize),
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mb: 0.75,
                })}
              >
                {t("vaccination:vaccineName")}
              </Typography>

              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(15, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                })}
              >
                {item.vaccineName}
              </Typography>

              <Typography
                sx={(theme) => ({
                  mt: 0.5,
                  fontSize: scaleFont(13, settings?.textSize),
                  color: theme.palette.text.secondary,
                })}
              >
                {item.animalName}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3.5, pt: 1, pb: 3, gap: 1.25 }}>
        <Button
          onClick={onClose}
          fullWidth
          sx={(theme) => ({
            py: 1.25,
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
          onClick={handleDelete}
          loading={deleteVaccinationMutation.isPending}
          fullWidth
          sx={{
            py: 1.25,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            fontSize: scaleFont(14, settings?.textSize),
            background: "linear-gradient(135deg, #e53535 0%, #c62828 100%)",
            color: "#fff",
            boxShadow: "0 6px 16px rgba(229,53,53,0.26)",
            "&:hover": {
              background: "linear-gradient(135deg, #d83232 0%, #b71c1c 100%)",
              boxShadow: "0 8px 20px rgba(229,53,53,0.34)",
            },
          }}
        >
          {t("vaccination:delete")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};