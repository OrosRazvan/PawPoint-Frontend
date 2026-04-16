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
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { DewormingCardItem } from "../types/deworming";
import { DewormingTypeLabels } from "../types/deworming";

type Props = {
  open: boolean;
  item: DewormingCardItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const formatDewormingType = (value: number) => {
  return DewormingTypeLabels[value] ?? "Unknown";
};

export const DeleteDewormingDialog = ({
  open,
  item,
  onClose,
  onConfirm,
  isLoading,
}: Props) => {
  const { t } = useTranslation(["deworming"]);
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
                    theme.palette.error.main,
                    0.14
                  )} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`
                : "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
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
                  background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                  color: "#fff",
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                  })}
                >
                  {t("deworming:deleteDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                  })}
                >
                  {t("deworming:deleteDialogSubtitle")}
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
        <Stack spacing={3}>
          {item && (
            <Box
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.03)
                    : theme.palette.background.paper,
              })}
            >
              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(15, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  })}
                >
                  {item.animalName}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.2,
                  })}
                >
                  {formatDewormingType(item.type)}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={(theme) => ({
              px: 2,
              py: 1.75,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.1)
                  : "#fff5f5",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.24)
                  : "#fcd9d9"
              }`,
            })}
          >
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13.5, settings?.textSize),
                color:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.95)
                    : "#7a3030",
                lineHeight: 1.65,
              })}
            >
              {t("deworming:deleteConfirmMessage")}
            </Typography>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1.5}>
            <Button
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
              })}
            >
              {t("deworming:cancel")}
            </Button>

            <LoadingButton
              fullWidth
              loading={isLoading}
              onClick={onConfirm}
              variant="contained"
              sx={{
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(14, settings?.textSize),
                background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                color: "#fff",
              }}
            >
              {t("deworming:deleteConfirm")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};