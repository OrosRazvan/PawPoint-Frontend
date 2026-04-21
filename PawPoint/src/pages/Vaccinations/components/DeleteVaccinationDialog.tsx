import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { VaccinationCardItem } from "../types/vaccination";

type Props = {
  open: boolean;
  item: VaccinationCardItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export const DeleteVaccinationDialog = ({
  open,
  item,
  onClose,
  onConfirm,
  isLoading,
}: Props) => {
  const { t } = useTranslation(["vaccination"]);
  const { data: settings } = useSettings();

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
              ? "0 24px 64px rgba(0,0,0,0.42), 0 4px 16px rgba(0,0,0,0.28)"
              : "0 20px 60px rgba(7,28,66,0.16), 0 4px 12px rgba(7,28,66,0.07)",
        }),
      }}
    >
      {/* Red accent strip at top */}
      <Box
        sx={{
          height: 4,
          background: "linear-gradient(90deg, #e53535, #f06060)",
        }}
      />

      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={(theme) => ({
            px: 3,
            pt: 2.75,
            pb: 2.5,
          })}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(229,53,53,0.38)",
                })}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
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
                  {t("vaccination:deleteDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(12.5, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.35,
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
                width: 30,
                height: 30,
                mt: 0.3,
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

      <DialogContent sx={{ px: 3, pb: 3, pt: "20px !important" }}>
        <Stack spacing={2.5}>
          {/* Vaccination item preview */}
          {item && (
            <Box
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.25,
                py: 1.75,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.03)
                    : alpha("#000", 0.015),
              })}
            >
              <Box
                sx={(theme) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  flexShrink: 0,
                  background:
                    theme.palette.mode === "dark"
                      ? `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.18
                        )} 0%, ${alpha(theme.palette.primary.light, 0.12)} 100%)`
                      : "linear-gradient(135deg, #fbf2ea 0%, #fde8c8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: scaleFont(20, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                })}
              >
                {item.animalName?.charAt(0)?.toUpperCase() ?? "V"}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={(theme) => ({
                    fontSize: scaleFont(14, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    letterSpacing: "-0.2px",
                  })}
                >
                  {item.animalName}
                </Typography>
                <Typography
                  noWrap
                  sx={(theme) => ({
                    fontSize: scaleFont(12.5, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.2,
                  })}
                >
                  {item.vaccineName}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Warning message */}
          <Box
            sx={(theme) => ({
              display: "flex",
              gap: 1.5,
              px: 2,
              py: 1.75,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.09)
                  : "#fff5f5",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.22)
                  : "#fcd9d9"
              }`,
            })}
          >
            <WarningAmberRoundedIcon
              sx={(theme) => ({
                fontSize: 18,
                mt: 0.1,
                flexShrink: 0,
                color:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.9)
                    : "#c53030",
              })}
            />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13, settings?.textSize),
                color:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.9)
                    : "#7a3030",
                lineHeight: 1.6,
              })}
            >
              {t("vaccination:deleteConfirmMessage")}
            </Typography>
          </Box>

          <Divider />

          {/* Action buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              onClick={onClose}
              sx={(theme) => ({
                py: 1.3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(13.5, settings?.textSize),
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
              fullWidth
              loading={isLoading}
              onClick={onConfirm}
              variant="contained"
              sx={{
                py: 1.3,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(13.5, settings?.textSize),
                background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                color: "#fff",
                boxShadow: "0 6px 16px rgba(229,53,53,0.26)",
                "&:hover": {
                  background: "linear-gradient(135deg, #d92d2d 0%, #b92525 100%)",
                  boxShadow: "0 8px 20px rgba(229,53,53,0.32)",
                },
              }}
            >
              {t("vaccination:deleteConfirm")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};